import { Attachment } from "nodemailer/lib/mailer";

export interface MailOptions {
    id?:string;
    to: string;
    subject: string;
    body: string;
    html?: any;
    attachments?:Attachment[];
    frontendUrl?: string;
    attendee?: any;
    order?: any;
}

