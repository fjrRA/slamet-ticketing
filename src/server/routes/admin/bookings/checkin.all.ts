// src/server/routes/admin/bookings/checkin.all.ts
import { Router } from 'express';
import { prisma } from '@server/libs/prisma';
import { AppError } from '../../../utils/app-error';

export default function registerCheckinAll(r: Router) {
  r.post('/:id/checkin-all', async (req, res) => {
    const { id } = req.params;

    const bk = await prisma.booking.findUnique({ where: { id }});
    if (!bk) throw new AppError('Booking tidak ditemukan', 404);
    if (bk.status !== 'PAID') throw new AppError('Check-in hanya untuk booking PAID', 400);

    const up = await prisma.bookingMember.updateMany({
      where: { bookingId: id, checkedIn: false },
      data: { checkedIn: true, checkedInAt: new Date() },
    });

    res.json({ ok: true, count: up.count });
  });
}
