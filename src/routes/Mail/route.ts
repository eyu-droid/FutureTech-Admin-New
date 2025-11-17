import { Request, Response, Router } from "express";
import { MailController } from "../../controllers/mail.controller";
import AuthAPIKey from "../../middlewares/authAPIKey";
import AuthGuard from "../../middlewares/authGuard";

const mailController = new MailController();

const mailRoute = Router();

mailRoute.post('/sendmail', [AuthAPIKey, AuthGuard], (req:Request, res:Response)=>mailController.sendMail(req, res));
mailRoute.get('/messages', [AuthAPIKey, AuthGuard], (req:Request, res:Response)=>mailController.getMessages(req, res));
mailRoute.post('/send-qrcode', [AuthAPIKey, AuthGuard], (req:Request, res:Response)=>mailController.sendQRCode(req, res));

export default mailRoute;