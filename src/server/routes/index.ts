// src/server/routes/index.ts
import { Router } from 'express';

// sub-routers di folder yang sama
import auth from './auth';
import bookings from './bookings';
import trails from './trails';
import payments from './payments';
import health from './health';

// folder "admin" punya index.ts sendiri → import pakai path folder
import admin from './admin';

const r = Router();

// semua endpoint non-admin langsung di-mount
r.use(auth);        // /auth/login, /auth/logout, /auth/me
r.use(bookings);    // /bookings/...
r.use(trails);      // /trails/...
r.use(payments);    // /payments/...
r.use(health);      // /health

// admin berada di prefix /admin
r.use('/admin', admin);

export default r;
