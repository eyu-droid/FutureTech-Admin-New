import defaultTemplate from "../mail/templates/defaulttemplate";
import WelcomeTemplate from "../mail/templates/welcometemplate";
import { db } from "../util/config/db";
import logger from "../util/logger";
import { addToMailQueue } from "../workers/mail.worker";

export class CheckInService{
    constructor(){}

    async checkOrderNo(orderNo:string){
        if(!orderNo || orderNo.length > 50){
            // keep validation sensible; original code used > 5 which is likely incorrect for some order formats,
            // but maintain a defensive upper bound to avoid accidental long payloads.
            throw new Error('Invalid code');
        }

        const order = await db.orders.findFirst({
            where:{
                orderNo: orderNo
            },
        });

        if(!order) 
            throw new Error('ticket not found');

        const attendee = await db.attendees.findUnique({
            where:{
                id: order.attendeeId
            }
        });

        // If there is no attendee record for the order, treat as an error
        if(!attendee){
            throw new Error('attendee not found');
        }

        // Perform atomic check-in using a transaction:
        // - updateMany ensures we only transition status -> CHECKEDIN when previous status wasn't CHECKEDIN
        // - create checkinTracker record as part of the same transaction
        const txResult = await db.$transaction(async (tx) => {
            // conditional update; count will be 1 when we successfully flipped status, 0 if it was already CHECKEDIN
            const updateRes = await tx.attendees.updateMany({
                where: {
                    id: attendee.id,
                    status: { not: 'CHECKEDIN' }
                },
                data: {
                    status: 'CHECKEDIN',
                    updatedAt: new Date()
                }
            });

            if(updateRes.count === 0){
                // nothing to do; someone else already checked this attendee in
                const latest = await tx.attendees.findUnique({ where: { id: attendee.id } });
                return { status: 'already', order, attendee: latest };
            }

            // record the check-in event
            await tx.checkinTracker.create({
                data: {
                    attendeeId: attendee.id,
                    checkedTime: new Date()
                }
            });

            // read back the updated attendee
            const updatedAttendee = await tx.attendees.findUnique({ where: { id: attendee.id } });

            return { status: 'success', order, attendee: updatedAttendee };
        });

        // Only enqueue the welcome mail if the transaction succeeded and the status changed
        if(txResult && txResult.status === 'success' && txResult.attendee){
            try{
                addToMailQueue({
                    to: txResult.attendee.email,
                    subject: 'Welcome to Future Tech Addis Expo',
                    body: '',
                    html: defaultTemplate('','', WelcomeTemplate({
                        ticket: order.ticket,
                        days: '3 days',
                        eventName: 'Future Tech Addis Expo',
                        location: 'Addis Ababa Convention Center',
                        time: new Date().toLocaleTimeString()
                    }))
                });
            }catch(err){
                logger.warn('Failed to enqueue welcome email after successful check-in: ' + (err as Error).message);
            }
        }

        return txResult;
    }
}