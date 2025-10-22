// src/server/routes/admin/index.ts
import { Router } from 'express';
import bookingsRouter from './bookings/index'; // explicit /index biar aman ESM
import statsRouter from './stats';
import trailsRouter from './trails/index'; 
import slotsRouter from './slots';
import pricesRouter from './prices';
import closuresRouter from './closures/index';
import paymentsRouter from './payments';
import usersRouter from './users';

const admin = Router();

// daftar semua sub-router admin di sini
admin.use(statsRouter);   
admin.use('/bookings', bookingsRouter);
admin.use('/trails', trailsRouter);
admin.use('/slots', slotsRouter);
admin.use('/prices', pricesRouter);
admin.use('/closures', closuresRouter);
admin.use('/payments', paymentsRouter);
admin.use('/users', usersRouter);
// contoh lain nanti: admin.use('/stats', statsRouter)

export default admin;
