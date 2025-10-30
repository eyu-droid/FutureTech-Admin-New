import * as fs from 'fs';
import csvParser, { CsvParser } from "csv-parser";
import logger from '../util/logger';
import * as xlsx from 'xlsx';
export class FileService{
    constructor(){}

    async readCsvFile(filePath:string, cb:(data:any[], error?:Error)=>void){
        let result:any[] = [];
         fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => result.push(data))
        .on('end', ()=>cb(result))
        .on('error', (err) => {
            cb(result, err)
            logger.error(err); 
            fs.unlinkSync(filePath)
            fs.rm(filePath, (err)=>logger.error(err)); 
        })
    }

    async readExcelFile(filePath:string, cb:(data:any[], err?:unknown)=>void){
        try{
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const workSheet = workbook.Sheets[sheetName];
    
            const result = xlsx.utils.sheet_to_json(workSheet);
            cb(result);
        }catch(err){
            cb([], err);
        }

    }

    async writeToCsvFile(filePath:string, data:any[], cb:(error?:Error)=>void){
        try{
            const ws = xlsx.utils.json_to_sheet(data);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
            xlsx.writeFile(wb, filePath, { bookType: 'csv' });
            cb();
        }catch(err){
            cb(err as Error);
        }
    }

    async writeToExcelFile(filePath:string, data:any[], cb:(error?:Error)=>void){
        try{
            const ws = xlsx.utils.json_to_sheet(data);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
            xlsx.writeFile(wb, filePath, { bookType: 'xlsx' });
            cb();
        }catch(err){
            cb(err as Error);
        }
    }
}