// src/server/routes/bookings/index.ts
import { Router } from 'express';
import { requireUser } from '@server/middlewares/auth';
import { createBooking } from './handlers/create';
import { getMyBookings } from './handlers/getMe';
import { getBookingByOrderId } from './handlers/getOne';
import { getTicketPdf } from './handlers/ticket';

const r = Router();

// /api/bookings
r.post('/', requireUser, createBooking);
r.get('/me', requireUser, getMyBookings);
r.get('/:orderId', getBookingByOrderId);
r.get('/:orderId/ticket', getTicketPdf);

export default r;
