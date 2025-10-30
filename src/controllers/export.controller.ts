import { Request, Response } from "express";
import { SubmissionService } from "../services/submission.service";
import { FileService } from "../services/file.service";
import logger from "../util/logger";
import * as fs from 'fs';
export class ExportController {
    private submissionService;
    private fileService;
    constructor(){
        this.submissionService = new SubmissionService();
        this.fileService = new FileService();
    }
    async exportLocalCompanies(req: Request, res: Response){
        // Implementation for exporting local companies
        try{
            const localCompanies = await this.submissionService.getLocalCompanySubmissions();
            const urlParsedCompanies = localCompanies?.map((company:any)=>{
                 const urlRegex = /https?:\/\/[^\s"]+/g;
                return {
                    ...company,
                    companyProfile: company.companyProfile.match(urlRegex)?.[0] || '',
                    companyLicense: company.companyLicense.match(urlRegex)?.[0] || ''
                }
            })
            await this.fileService.writeToExcelFile('local_companies.xlsx', urlParsedCompanies, (error?:Error)=>{
                if(error){
                    res.status(500).json({message: error.message});
                }else{
                    res.download('local_companies.xlsx', 'local_companies.xlsx', (err)=>{
                        if(err){
                            res.status(500).json({message: err.message});
                        }
                    });
                }
            });
        }catch(err){
            logger.error((err as Error).message);
            res.status(500).json({message: 'Internal Server Error'});
        }finally{
            fs.rm('local_companies.xlsx', (err)=>{
                if(err){
                    logger.error(`unable to remove file embassy.xlsx ${err.message}`)
                    
                }
            });
        }

    }

    async exportInternationalCompanies(req: Request, res: Response){
        // Implementation for exporting local companies
        try{
            const localCompanies = await this.submissionService.getInternationalCompanySubmissions();
            const urlParsedCompanies = localCompanies?.map((company:any)=>{
                 const urlRegex = /https?:\/\/[^\s"]+/g;
                return {
                    ...company,
                    passport: company?.passport?.match(urlRegex)?.[0] || '',
                    companyProfile: company?.companyProfile?.match(urlRegex)?.[0] || ''
                }
            })
            await this.fileService.writeToExcelFile('international_companies.xlsx', urlParsedCompanies, (error?:Error)=>{
                if(error){
                    res.status(500).json({message: error.message});
                }else{
                    res.download('international_companies.xlsx', 'international_companies.xlsx', (err)=>{
                        if(err){
                            res.status(500).json({message: err.message});
                        }
                    });
                }
            });
        }catch(err){
            logger.error((err as Error).message);
            res.status(500).json({message: 'Internal Server Error'});
        }finally{
            fs.rm('international_companies.xlsx', (err)=>{
                if(err){
                    logger.error(`unable to remove file embassy.xlsx ${err.message}`)
                    
                }
            });
        }

    }

    async exportngo(req: Request, res: Response){
        // Implementation for exporting local companies
        try{
            const localCompanies = await this.submissionService.getNGOSubmissions();
            const urlParsedCompanies = localCompanies?.map((company:any)=>{
                 const urlRegex = /https?:\/\/[^\s"]+/g;
                return {
                    ...company,
                    orgFile: company.orgFile.match(urlRegex)?.[0] || ''
                }
            })
            await this.fileService.writeToExcelFile('ngo.xlsx', urlParsedCompanies, (error?:Error)=>{
                if(error){
                    res.status(500).json({message: error.message});
                }else{
                    res.download('ngo.xlsx', 'ngo.xlsx', (err)=>{
                        if(err){
                            res.status(500).json({message: err.message});
                        }
                    });
                }
            });
        }catch(err){
            logger.error((err as Error).message);
            res.status(500).json({message: 'Internal Server Error'});
        }finally{
            fs.rm('ngo.xlsx', (err)=>{
                if(err){
                    logger.error(`unable to remove file embassy.xlsx ${err.message}`)
                    
                }
            });
        }

    }
    async exportstartup(req: Request, res: Response){
        // Implementation for exporting local companies
        try{
            const localCompanies = await this.submissionService.getStartupSubmissions();
            const urlParsedCompanies = localCompanies?.map((company:any)=>{
                 const urlRegex = /https?:\/\/[^\s"]+/g;
                return {
                    ...company,
                    pitchdeck: company.pitchdeck.match(urlRegex)?.[0] || '',
                    govId: company.govId.match(urlRegex)?.[0] || ''
                }
            })
            await this.fileService.writeToExcelFile('startup.xlsx', urlParsedCompanies, (error?:Error)=>{
                if(error){
                    res.status(500).json({message: error.message});
                }else{
                    res.download('startup.xlsx', 'startup.xlsx', (err)=>{
                        if(err){
                            res.status(500).json({message: err.message});
                        }
                    });
                }
            });
        }catch(err){
            logger.error((err as Error).message);
            res.status(500).json({message: 'Internal Server Error'});
        }finally{
            fs.rm('startup.xlsx', (err)=>{
                if(err){
                    logger.error(`unable to remove file embassy.xlsx ${err.message}`)
                    
                }
            });
        }

    }
    async exportembassy(req: Request, res: Response){
        // Implementation for exporting local companies
        try{
            const localCompanies = await this.submissionService.getEmabassySubmissions();
            const urlParsedCompanies = localCompanies?.map((company:any)=>{
                 const urlRegex = /https?:\/\/[^\s"]+/g;
                return {
                    ...company,
                    passport: company.passport.match(urlRegex)?.[0] || '',
                }
            })
            await this.fileService.writeToExcelFile('embassy.xlsx', urlParsedCompanies, (error?:Error)=>{
                if(error){
                    res.status(500).json({message: error.message});
                }else{
                    res.download('embassy.xlsx', 'embassy.xlsx', (err)=>{
                        if(err){
                            res.status(500).json({message: err.message});
                        }
                    });
                }
            });
        }catch(err){
            logger.error((err as Error).message);
            res.status(500).json({message: 'Internal Server Error'});
        }
        finally{
            fs.rm('embassy.xlsx', (err)=>{
                if(err){
                    logger.error(`unable to remove file embassy.xlsx ${err.message}`)
                    
                }
            });
        }

    }
}