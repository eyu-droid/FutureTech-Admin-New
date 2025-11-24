import { Job, Queue, Worker } from "bullmq";
import redis from "../util/config/redis";
import { MailService } from "../services/mail.service";
import { MailOptions } from "../types/mail";
import logger from "../util/logger";
import * as QRCode from 'qrcode';
import qrCodeTemplate from "../mail/templates/qrcode_template";
import { MessageService } from "../services/message.service";
import defaultTemplate from "../mail/templates/defaulttemplate";

const mailQueue = new Queue("mailQueue", {
    connection: redis,
});

export const addToMailQueue = async (data: MailOptions) => {
    if (data.attendee) {
        await mailQueue.add("sendQRCode", data);
    } else {
        await mailQueue.add("sendMail", data);
    }
}
const mailService = new MailService();
const messageService = new MessageService();

export const mailWorker = new Worker("mailQueue", async (job: Job) => {
    try {
        if (job.name === "sendMail") {
            // Avoid optional chaining in this worker to keep parsing predictable.
            const sent = await mailService.sendMail(job.data.to, job.data.subject, job.data.body, job.data.html, job.data.attachments);
            logger.info(`message sent to ${job.data.to}`)
            await messageService.updateMessageStatus(job.data.id, 'Completed');
            return sent;
        } else if (job.name === "sendQRCode") {
            // Destructure frontendUrl from the job payload and validate payload presence
            const { attendee, order, frontendUrl } = job.data || {};
            if (!attendee || !order) {
                throw new Error('Invalid job payload: missing attendee or order');
            }
            const qrCodeData = order.orderNo;

            const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, { type: 'png', width: 400 });

            // Prefer a frontend URL supplied with the job (job.data.frontendUrl). If not provided, fall back to ENV, then to production host.
            const suppliedFrontend = (typeof frontendUrl === 'string' && frontendUrl.trim() !== '') ? frontendUrl : (process.env.FRONTEND_URL || '');
            const frontend = (suppliedFrontend && suppliedFrontend.trim() !== '') ? suppliedFrontend.replace(/\/$/, '') : 'https://futuretechaddis.com';
            const printUrl = `${frontend}/print-qr/${order.orderNo}?name=${encodeURIComponent(attendee.fullname)}&ticket=${encodeURIComponent(order.ticket || '')}`;

            // Content-ID used for the inline image attachment
            const cidRef = 'qrcode.png';

            // Embed the existing QR HTML inside the general default template so the email uses the organization's template styles.
            // Pass the qr template as the custom message to defaultTemplate so it renders as a badge inside the standard template.
            const qrHtml = qrCodeTemplate(attendee.fullname, `cid:${cidRef}`, printUrl);
            const html = defaultTemplate('', undefined, qrHtml);

            const sent = await mailService.sendMail(attendee.email, 'Your Event QR Code', '', html, [{
                filename: 'qrcode.png',
                content: qrCodeBuffer,
                contentType: 'image/png',
                cid: cidRef
            }]);

            logger.info(`QR code sent to ${attendee.email}`);
            // Only attempt to update message status when we have an id in the job payload
            if (job && job.data && job.data.id) {
                await messageService.updateMessageStatus(job.data.id, 'Completed');
            }
            return sent;
        }
    } catch (error) {
        try {
            const errMsg = error && (error as any).message ? (error as any).message : String(error);
            const jobId = job && (job as any).id ? (job as any).id : 'unknown';
            logger.error(`Job ${jobId} failed with error ${errMsg}`);
            // Safely update the message status only when the job contains a message id
            if (job && job.data && job.data.id) {
                await messageService.updateMessageStatus(job.data.id, 'Failed');
            }
        } catch (innerErr) {
            logger.error('Failed to record job failure: ' + (innerErr && (innerErr as any).message ? (innerErr as any).message : String(innerErr)));
        }
        throw error;
    }
}, {
    connection: redis,
});

mailWorker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed`);
});

mailWorker.on("failed", (job, err) => {
    // Avoid optional chaining in runtime event handlers; provide safe fallback values.
    const jobId = job && (job as any).id ? (job as any).id : 'unknown';
    const errMsg = err && err.message ? err.message : String(err);
    logger.warn(`Job ${jobId} failed with error ${errMsg}`);
});

mailWorker.on("error", (err) => {
    logger.error(`Worker error: ${err.message}`);
});
