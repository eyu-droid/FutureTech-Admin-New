import { Request, Response, Router } from "express";
import AuthAPIKey from "../../middlewares/authAPIKey";
import { AttendeeController } from "../../controllers/attendee.controller";
import { AttendeeDTO } from "../../types/attendee";
import { CheckInDto } from "../../types/order";
import { CheckInController } from "../../controllers/checkin.controller";
import AuthGuard from "../../middlewares/authGuard";
import rateLimit from "express-rate-limit";
import { rateLimiting } from "../../middlewares/rateLimiting";

const attendeeController = new AttendeeController();
const checkInController = new CheckInController();
const attendeeRoutes = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit:3,
  message: { message: 'Too many requests. Please try again later.' }
});
attendeeRoutes.post('/checkout', [AuthAPIKey, limiter], (req:Request, res:Response)=>attendeeController.createAttendee(req, res));
attendeeRoutes.post('/createBulkAttendees', [AuthAPIKey, AuthGuard], (req:Request<{}, any, {attendees: AttendeeDTO[]}>, res:Response)=>attendeeController.createBulkAttendees(req, res));
attendeeRoutes.post('/checkin', [AuthAPIKey], (req:Request<CheckInDto>, res:Response)=>checkInController.checkIn(req, res));
attendeeRoutes.get('/getConfirmedList', [AuthAPIKey], (req: Request, res: Response)=>checkInController.getConfirmed(req, res));
attendeeRoutes.get('/getAllAttendees', [AuthAPIKey, AuthGuard], (req: Request, res:Response)=>attendeeController.getAllAttendees(req, res));
export default attendeeRoutes;