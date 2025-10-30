import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './util/logger';
import authRoutes from './routes/Auth/route';
import userRoutes from './routes/User/route';
import attendeeRoutes from './routes/Attendees/route';
import ticketRoutes from './routes/Ticket/route';
import submissionRoute from './routes/Submission/route';
import followRoute from './routes/FollowUp/route';
import followupNoteRoute from './routes/FollowUpNote/route';
import mailRoute from './routes/Mail/route';
import uploadRouter from './routes/Uploads/route';
import partnerRoute from './routes/Partner/route';
import roleRoutes from './routes/Role/route';
import menuRoute from './routes/Menu/route';
import permissionRoutes from './routes/Permission/route';
import exportRoute from './routes/Download/route';

const app = express();


const port = process.env.PORT || 3000;

// app.use(limiter);
const whitelist = process.env.FRONTEND_URL?.split(',') || [];

app.use(
  cors({
   origin(requestOrigin, callback) {
     if(whitelist.indexOf(requestOrigin || '')!== -1 || !requestOrigin){
      callback(null, true);
     }else{
      callback(new Error('Not allowed by CORS'));
     }
   },
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/attendee', attendeeRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/register', submissionRoute);
app.use('/api/submission', followRoute);
app.use('/api/progress', followupNoteRoute);
app.use('/api/mail', mailRoute);
app.use('/api/partner', partnerRoute);
app.use('/api/menu', menuRoute);
app.use('/api/upload', uploadRouter);
app.use('/api/role', roleRoutes);
app.use('/api/export', exportRoute);
app.use('/api/permission', permissionRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
