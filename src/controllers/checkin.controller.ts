import { Request, Response } from "express";
import { CheckInService } from "../services/checkin.service";
import { CheckInDto } from "../types/order";
import logger from "../util/logger";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class CheckInController{
    private checkInService;
    constructor(){
        this.checkInService = new CheckInService();
    }

    async checkIn(req:Request<CheckInDto>, res:Response){
        const {orderNo} = req.body;
        if(!orderNo){
            res.status(400).json({message: 'invalid ticket'});
            return;
        }
        try{
            const result = await this.checkInService.checkOrderNo(orderNo);
            // success case
            if(result && (result as any).status === 'success'){
                const { order, attendee, confirmed } = result as any;
                // Log that the confirmed row was created/updated when available
                if(confirmed && attendee && attendee.id){
                    logger.info('Confirmed row upserted for attendee: ' + attendee.id);
                }
                res.status(200).json({message:'Checked in successfully', data: { order, attendee, confirmed }});
                return;
            }
            // already-checked-in case: return 200 but indicate it was already checked
            else if(result && (result as any).status === 'already'){
                const { order, attendee, confirmed } = result as any;
                // If a confirmed row exists, log it for visibility
                if(confirmed && attendee && attendee.id){
                    logger.info('Attendee already checked in; confirmed row exists for attendee: ' + attendee.id);
                }
                res.status(200).json({message:'Already checked in', data: { order, attendee, confirmed }});
                return;
            }
            // any other result - treat as validation failure
            else{
                res.status(400).json({message: 'Can not validate code. Please try again!'});
                return;
            }
        }catch(error){
            logger.error(error);
            if(error instanceof PrismaClientKnownRequestError){
                res.status(400).json({message: 'invalid code'});
                return;
            }
            res.status(500).json({message:(error as Error).message});
        }
    }

    /**
     * GET /attendee/getConfirmedList
     * Returns rows from the legacy `confirmed` table so the check-in dashboard can render them.
     * This delegates to CheckInService.getConfirmedList(), which uses a raw query because
     * `confirmed` is ignored by Prisma.
     */
    async getConfirmed(req: Request, res: Response) {
        try {
            const list = await this.checkInService.getConfirmedList();
            res.status(200).json({ message: 'fetched successful', data: list });
            return;
        } catch (error) {
            logger.error('getConfirmed error: ' + (error as Error).message);
            res.status(500).json({ message: 'unable to fetch confirmed list' });
            return;
        }
    }
}