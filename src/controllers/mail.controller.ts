import { Request, Response } from "express";
import { addToMailQueue, mailWorker } from "../workers/mail.worker";
import { MessageService } from "../services/message.service";
import { OrderService } from "../services/order.service";
import { Invitation } from "../mail/templates/invitation";
import defaultTemplate from "../mail/templates/defaulttemplate";
import logger from "../util/logger";

export class MailController{
    private messageService;
    private orderService;
    constructor(){
        this.messageService = new MessageService();
        this.orderService = new OrderService();
    }

    async sendMail(req:Request, res:Response){
        const emails = req.body;
        try{
            if(!emails.data || !Array.isArray(emails.data) || emails.data.length === 0){
                res.status(400).json({message: 'malformed data or missing values'});
                return;
            }
            for(const email of emails.data){
                const message = await this.messageService.sendMessage({attachedTo: parseInt(email.attachedTo), body: email.body, title: email.title, reciver: email.reciver, sender: req.user?.email?req.user.email:'system@futuretech.com', sentAt: new Date(), sentBy: req.user?.userId?req.user?.userId:'0', status: 'Pending'});
                if(message){
                    addToMailQueue({to: email.reciver, subject: email.title, body: email.body, html: defaultTemplate(email.body), id: message.id});
                }
            }
            //send email logic here
            res.status(200).json({message: 'emails sent successfully'});
        }catch(error){
            res.status(500).json({message: 'internal server error'});
        }
    }

    async getMessages(req:Request, res:Response){
        try{
            const messages = await this.messageService.getMessages();
            res.status(200).json({message: 'submitted successful', data: messages});
            return;
        }catch(err){
            res.status(500).json({message: 'something went wrong. Please try again'});
            return;
        }
    }

    async sendQRCode(req: Request, res: Response) {
        const { attendees } = req.body;

        if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        try {
            for (const attendee of attendees) {

                const orderDto = {
                    attendeeId: attendee.id,
                    ticket: attendee.ticketType || 'Event'
                };
                const order = await this.orderService.createOrder(orderDto);


                const message = await this.messageService.sendMessage({
                    attachedTo: order ? 0 : 0,
                    body: `QR Code for ${attendee.fullname}`,
                    title: 'Your QR Code for the Event',
                    reciver: attendee.email,
                    sender: req.user?.email || 'system@futuretech.com',
                    sentAt: new Date(),
                    sentBy: req.user?.userId || '0',
                    status: 'Pending'
                });

                if (message) {
                    addToMailQueue({
                        to: attendee.email,
                        subject: 'Your QR Code for the Event',
                        body: `Here is your QR code, ${attendee.fullname}.`,
                        html: '',
                        attendee: attendee,
                        order: order,
                        id: message.id
                    });
                }
            }

            res.status(200).json({ message: 'QR codes are being sent' });
        } catch (error) {
            logger.error(`sendQRCode failed: ${error}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
