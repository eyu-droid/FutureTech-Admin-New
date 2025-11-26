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
        // - upsert a record into the `confirmed` table so the check-in menu can read from it (create or update)
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
                // try to fetch an existing confirmed row for completeness so the caller can refresh appropriately
                const existingConfirmed = await tx.confirmed.findUnique({ where: { id: attendee.id } });
                return { status: 'already', order, attendee: latest, confirmed: existingConfirmed };
            }

            // record the check-in event
            await tx.checkinTracker.create({
                data: {
                    attendeeId: attendee.id,
                    checkedTime: new Date()
                }
            });

            // upsert into the confirmed table using Prisma model (confirmed is now exposed in schema)
            // This will either create a new confirmed row or update the existing one, keeping data idempotent.
            logger.info('Upserting confirmed row for attendee: ' + attendee.id);
            const confirmedRecord = await tx.confirmed.upsert({
                where: { id: attendee.id },
                update: {
                    fullname: attendee.fullname,
                    phone: attendee.phone ?? '',
                    email: attendee.email,
                    registereddate: attendee.createdAt ?? new Date(),
                    checkedindate: new Date()
                },
                create: {
                    id: attendee.id,
                    fullname: attendee.fullname,
                    phone: attendee.phone ?? '',
                    email: attendee.email,
                    registereddate: attendee.createdAt ?? new Date(),
                    checkedindate: new Date()
                }
            });
            logger.info('Upsert completed for attendee: ' + attendee.id + ' confirmed id: ' + (confirmedRecord?.id ?? 'n/a'));

            // read back the updated attendee
            const updatedAttendee = await tx.attendees.findUnique({ where: { id: attendee.id } });

            // return confirmed record alongside order/attendee so frontend can immediately refresh its list if desired
            return { status: 'success', order, attendee: updatedAttendee, confirmed: confirmedRecord };
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

    /**
     * Returns the rows from the `confirmed` table.
     * This helper uses a raw query because `confirmed` is ignored in the Prisma schema.
     * The controller or other callers can use this to populate the check-in table.
     */
    async getConfirmedList(): Promise<any[]> {
        // Use Prisma client to read from the confirmed model (now present in the schema)
        const rows = await db.confirmed.findMany({
            select: {
                id: true,
                fullname: true,
                phone: true,
                email: true,
                registereddate: true,
                checkedindate: true
            },
            orderBy: {
                checkedindate: 'desc'
            }
        });
        return rows;
    }
}
