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
            const checkInStatus = await this.checkInService.checkOrderNo(orderNo);
            if(checkInStatus=='success'){
                res.status(200).json({message:'Checked in successfully'})
                return;
            }
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
}