import { Job, Queue, Worker } from "bullmq";
import redis from "../util/config/redis";
import { MailService } from "../services/mail.service";
import { MailOptions } from "../types/mail";
import logger from "../util/logger";
import * as QRCode from 'qrcode';
import qrCodeTemplate from "../mail/templates/qrcode_template";
import { MessageService } from "../services/message.service";

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
            const sent = await mailService.sendMail(job.data.to, job.data.subject, job.data.body, job.data?.html, job.data?.attachments);
            logger.info(`message sent to ${job.data.to}`)
            await messageService.updateMessageStatus(job.data.id, 'Completed');
            return sent;
        } else if (job.name === "sendQRCode") {
            const { attendee, order } = job.data;
            const qrCodeData = order.orderNo;
            const qrCodeImage = await QRCode.toDataURL(qrCodeData);
            const printUrl = `${process.env.FRONTEND_URL}/print-qr/${order.orderNo}?name=${encodeURIComponent(attendee.fullname)}`;
            const html = qrCodeTemplate(attendee.fullname, qrCodeImage, printUrl);
            const sent = await mailService.sendMail(attendee.email, 'Your Event QR Code', '', html, [{
                filename: 'qrcode.png',
                path: qrCodeImage,
                cid: 'qrcode'
            }]);
            logger.info(`QR code sent to ${attendee.email}`);
            await messageService.updateMessageStatus(job.data.id, 'Completed');
            return sent;
        }
    } catch (error) {
        logger.error(`Job ${job.id} failed with error ${error}`);
        await messageService.updateMessageStatus(job.data.id, 'Failed');
        throw error;
    }
}, {
    connection: redis,
});

mailWorker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed`);
});

mailWorker.on("failed", (job, err) => {
    logger.warn(`Job ${job?.id} failed with error ${err.message}`);
});

mailWorker.on("error", (err) => {
    logger.error(`Worker error: ${err.message}`);
});