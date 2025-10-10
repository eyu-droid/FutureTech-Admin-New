import * as fs from 'fs';
import csvParser, { CsvParser } from "csv-parser";

import { Request, Response } from "express";
import logger from '../util/logger';
import { PartnerService } from '../services/partner.service';
import { partners } from '@prisma/client';
import { generateId } from '../util/generateId';

export class PartnersController {
    private partnerService;
    constructor() {
        this.partnerService = new PartnerService
    }

    async uploadPartnersCSV(req: Request, res: Response) {
        if (!req.file) {
            res.status(400).json({ message: 'File Not Uploaded' });
            return;
        }
        let result:any[] = [];
        // res.status(200).json({ message: 'File uploaded successful' })
        const file = req.file;
        const filePath = `${file.destination}${file.filename}`;
        logger.info(filePath)
        fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => result.push(data))
        .on('end', ()=>{
            if(!result[0]['company name'] || !result[0]['company email'] || !result[0]['phone'] || !result[0]['interset Area'] || !result[0]['name']){
                res.status(400).json({message: 'Invaild file'})
                fs.rm(filePath,(err)=>{
                    if(err){
                        logger.error(`unable to remove file ${filePath} ${err.message}`)
                    }
                })
                return;
            }
            result.forEach(async(element) => {
                try{
                    const partnerDto:partners = {
                        id: await generateId(),
                        companyName: element['company name'],
                        email: element['company email'],
                        phoneNo: element['phone'],
                        interest: element['interset Area'],
                        license: element['License'],
                        createdDate: new Date(),
                        updateDate: new Date(),
                        fullName: element['name']
                    }

                     await this.partnerService.createPartner(partnerDto);
                }catch(err){

                    return
                }

            });
        })
        .on('error', (err) => {
            logger.error(err);
            fs.unlinkSync(filePath)
            fs.rm(filePath, (err)=>logger.error(err));
        })


    }

    async getAllPartners(req:Request, res: Response){
        const partners = await this.partnerService.getAllPartners();
        if(partners){
            res.status(200).json({message: 'no partners found', data:[]});
            return;
        }
        res.status(200).json({message: 'fetched successful', data:partners});
    }
}
