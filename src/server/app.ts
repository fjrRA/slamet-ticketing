// src/server/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { errorHandler } from './middlewares/error';
import health from './routes/health';
import trails from './routes/trails';
import bookings from './routes/bookings';
import payments from './routes/payments';
import authRoutes from './routes/auth';

import adminRouter from './routes/admin';
import adminCheckin from './routes/admin/checkin';
import { adminGate } from './middlewares/admin/admin-gate';

const app = express();

// Allowlist origin untuk dev
const allowList = new Set([
  process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

// Global middlewares (urutan penting)
app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);               // same-origin / curl
      cb(null, allowList.has(origin));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Public routes
app.use('/api/health', health);
app.use('/api/auth', authRoutes);
app.use('/api/trails', trails);
app.use('/api/bookings', bookings);

// Payments (Snap token + webhook)
app.use('/api/payments', payments);

// Admin routes (proteksi admin)
app.use('/api/admin', adminGate, adminRouter);
app.use('/api/admin', adminGate, adminCheckin);

// Error handler harus paling terakhir
app.use(errorHandler);

export default app;
