import { Request, Response } from "express";
import { AttendeeDTO } from "../types/attendee";
import logger from "../util/logger";
import { AttendeeService } from "../services/attendee.service";
import { OrderService } from "../services/order.service";
import { OrderDto } from "../types/order";
import * as QRCode from "qrcode";
import { MailService } from "../services/mail.service";
import { Invitation } from "../mail/templates/invitation";
import fs from 'fs/promises';
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { addToMailQueue, mailWorker } from "../workers/mail.worker";
import { SentMessageInfo } from "nodemailer";
import defaultTemplate from "../mail/templates/defaulttemplate";
import TicketTemplate from "../mail/templates/ticket";
import { db } from "../util/config/db";
export class AttendeeController {
    private attendeeService;
    private orderService;
    private mailService;
    constructor() {
        this.attendeeService = new AttendeeService();
        this.orderService = new OrderService();
        this.mailService = new MailService();
    }

    async createAttendee(req: Request, res: Response) {
        const attendee = req.body;
        try {
            if (!attendee) {
                logger.error('missing value')
                res.status(400).json({ message: 'missing values' });
                return;
            }
            const newAttendee = await this.attendeeService.createAttendee(attendee);
            if (newAttendee) {
                const order: OrderDto = {
                    attendeeId: newAttendee.id,
                    ticket: "Event",
                }
                try {

                const newOrder = await this.orderService.createOrder(order);
                if (newOrder) {
                    
                        addToMailQueue({ attendee: newAttendee, to: '', subject: '', body: '', order: newOrder });
                        res.status(200).json({ data: newOrder, message: 'Order created Successfully' });
                        return;

                        
                    }
                    } catch (error) {
                        logger.error(error + 'm');
                        // logger.error(error + ' new order failed');
                        res.status(500).json({message: error+' '});
                        return;
                    }

            }
            res.status(500).json({ message: 'something went wrong' })

        } catch (error) {
            logger.error(error);
            res.status(400).json({ message: 'unable to create order' });
        }

    }

    async createBulkAttendees(req: Request<{}, any, {attendees: AttendeeDTO[]}>, res: Response){
        const attendees = req.body.attendees;
        try{
            if(!attendees || !Array.isArray(attendees)){
                logger.error('malformed data or missing values')
                res.status(400).json({message: 'malformed data or missing values'});
                return;
            }
            const newAttendees = [];
            for(const attendee of attendees){
                try{
                    const newAttendee = await this.attendeeService.createAttendee(attendee);
                    if(newAttendee){
                         const order: OrderDto = {
                            attendeeId: newAttendee.id,
                            ticket: attendee.ticketType || "Event",
                        }
                        
                        const newOrder = await this.orderService.createOrder(order);
                        addToMailQueue({ attendee: newAttendee, to: '', subject: '', body: '', order: newOrder });
                        newAttendees.push(newAttendee);
                    }
                }catch(error){
                    logger.error(error+'');
                }
            }
            res.status(200).json({data: newAttendees, message: 'Attendees created Successfully'});
        }catch(error){
            logger.error(error);
            res.status(500).json({message: 'unable to create attendees'});
        }
    }

    async getAllAttendees(req:Request, res:Response){
        const {query} = req.query;
    
        const attendees = await this.attendeeService.getAllAttendees(query);
        
        res.status(200).json({message: 'fetched successful', data:attendees});

    }
    async getCheckInList(req:Request, res: Response){
        // Provides a paginated list of attendees enriched with their latest order and check-in status.
        // Query params:
        //   - page (default: 1)
        //   - limit (default: 10)
        const page = parseInt(String(req.query.page ?? '1'), 10) || 1;
        const limit = parseInt(String(req.query.limit ?? '10'), 10) || 10;
        const skip = (page - 1) * limit;

        try {
            // Fetch the requested page of attendees
            const attendees = await db.attendees.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            // Collect attendee ids to fetch related orders and checkins efficiently
            const attendeeIds = attendees.map(a => a.id);
            let orders: any[] = [];
            let checkins: any[] = [];

            if (attendeeIds.length > 0) {
                // Get the most relevant order(s) for these attendees; use order createdAt desc to pick latest
                orders = await db.orders.findMany({
                    where: {
                        attendeeId: { in: attendeeIds }
                    },
                    orderBy: { createdAt: 'desc' }
                });

                // Fetch any check-in tracker entries for these attendees
                checkins = await db.checkinTracker.findMany({
                    where: {
                        attendeeId: { in: attendeeIds }
                    },
                    orderBy: { checkedTime: 'desc' }
                });
            }

            // Map attendees to a combined payload
            const mapped = attendees.map(att => {
                const attendeeOrders = orders.filter(o => o.attendeeId === att.id);
                // choose the latest order if exists
                const latestOrder = attendeeOrders.length > 0 ? attendeeOrders[0] : null;
                // choose the latest checkin if exists
                const latestCheckin = checkins.find(c => c.attendeeId === att.id) || null;

                return {
                    id: att.id,
                    fullname: att.fullname,
                    email: att.email,
                    phone: att.phone,
                    status: att.status,
                    createdAt: att.createdAt,
                    updatedAt: att.updatedAt,
                    order: latestOrder ? {
                        id: latestOrder.id,
                        ticket: latestOrder.ticket,
                        orderNo: latestOrder.orderNo,
                        status: latestOrder.status,
                        createdAt: latestOrder.createdAt
                    } : null,
                    checkedIn: latestCheckin ? true : false,
                    checkedTime: latestCheckin ? latestCheckin.checkedTime : null
                };
            });

            // total records for pagination metadata
            const total = await db.attendees.count();

            res.status(200).json({
                message: 'fetched successful',
                data: {
                    items: mapped,
                    meta: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
            return;
        } catch (error) {
            logger.error('getCheckInList error: ' + (error as Error).message);
            res.status(500).json({ message: 'unable to fetch check-in list' });
            return;
        }
    }
}