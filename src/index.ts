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

const app = express();


const port = process.env.PORT || 3000;

// app.use(limiter);
const whitelist = process.env.FRONTEND_URL?.split(',') || [];

app.use(
  cors({
    origin(requestOrigin, callback) {
      if (whitelist.indexOf(requestOrigin || '') !== -1 || !requestOrigin) {
        callback(null, true);
      } else {
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
app.use('/api/permission', permissionRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// ============================================================
// TEMPORARY RECOVERY ENDPOINT - REMOVE AFTER USE
// ============================================================
app.get('/api/__recover__', async (req, res) => {
  const { secret } = req.query;
  if (secret !== 'futuretech-recover-2026') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  try {
    const { db } = await import('./util/config/db');
    const { hashSync, genSaltSync } = await import('bcrypt');
    const { v4: uuidv4 } = await import('uuid');
    const email = 'admin@futuretech.com';
    const password = 'FutureTech@2026!';
    const hashed = hashSync(password, genSaltSync(10));

    // Find the first available role to assign full menu access
    const firstRole = await db.role.findFirst({ orderBy: { id: 'asc' } });
    const roleId = firstRole?.id ?? null;

    const existing = await db.dashboard_user.findUnique({ where: { email } });
    if (existing) {
      await db.dashboard_user.update({ where: { email }, data: { password: hashed, isLocked: 0, roleId } });
    } else {
      await db.dashboard_user.create({
        data: { id: uuidv4(), email, password: hashed, roleId, isLocked: 0, isNew: 0, createdBy: 'recovery' }
      });
    }

    // Lock all other users so only admin@futuretech.com can access the dashboard
    const locked = await db.dashboard_user.updateMany({
      where: { email: { not: email } },
      data: { isLocked: 1 }
    });

    res.json({
      message: existing ? 'Password reset + role assigned' : 'Admin user created + role assigned',
      email,
      password,
      roleId,
      roleName: firstRole?.name,
      otherUsersLocked: locked.count
    });
  } catch (err) {
    res.status(500).json({ message: 'Recovery failed', error: (err as Error).message });
  }
});
// ============================================================
// END TEMPORARY RECOVERY ENDPOINT
// ============================================================

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
