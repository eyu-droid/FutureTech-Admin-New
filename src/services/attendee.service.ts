import { AttendeeDTO, AttendeeFilterArgs } from "../types/attendee";
import { db } from "../util/config/db";
import { generateId } from "../util/generateId";
import logger from "../util/logger";

export class AttendeeService{
    constructor(){}

    async createAttendee(attendeeDto: AttendeeDTO){
        if(!attendeeDto) throw new Error('missing values');
        try{
            const attendee = await db.attendees.findUnique({
                where:{
                    email: attendeeDto.email
                }
            });
            if(attendee){
               return attendee; 
            }

            const attendeeByFullName = await db.attendees.findUnique({
                where: {
                    fullname: attendeeDto.fullname
                }
            });

            if (attendeeByFullName) {
                const updatedAttendee = await db.attendees.update({
                    where: { id: attendeeByFullName.id },
                    data: { email: attendeeDto.email, phone: attendeeDto.phone }
                });
                return updatedAttendee;
            }
        }catch(error){
            throw error
        }
        try{
            
            const newAttendee = await db.attendees.create({
                data:{
                    id: await generateId(),
                    email: attendeeDto.email,
                    fullname: attendeeDto.fullname,
                    phone: attendeeDto.phone,
                    status: 'PENDING',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            
            return newAttendee;
        }catch(error){
            logger.error(error+' ');
            throw new Error('something went wrong');
        }        

    }

    async getAllAttendees(query?:any){
        
        if(query !== "undefined")
        {
            const filterby = query as string;

            return await db.attendees.findMany({
                where:{
                    OR:[
                        {
                            email: {
                                contains: filterby
                            }
                        },
                        {
                            fullname: {
                                contains: filterby
                            }
                        },
                        {
                            phone: {
                                contains: filterby
                            }
                        },
                        {
                            id: {
                                contains: filterby
                            }
                        },
                        
                    ]
                },
            })
        }
        return await db.attendees.findMany();
    }
    
}