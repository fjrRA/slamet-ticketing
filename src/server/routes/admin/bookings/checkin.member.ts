// src/server/routes/admin/bookings/checkin.member.ts
import { Router } from 'express';
import { prisma } from '@server/libs/prisma'; // atau: import { db } from '@server/libs/prisma'
import { AppError } from '../../../utils/app-error';

export default function registerCheckinMember(r: Router) {
  r.post('/:id/members/:memberId/checkin', async (req, res) => {
    const { id, memberId } = req.params;

    const bk = await prisma.booking.findUnique({ where: { id }});
    if (!bk) throw new AppError('Booking tidak ditemukan', 404);
    if (bk.status !== 'PAID') throw new AppError('Check-in hanya untuk booking PAID', 400);

    const mm = await prisma.bookingMember.findUnique({ where: { id: memberId } });
    if (!mm || mm.bookingId !== id) throw new AppError('Anggota tidak ditemukan untuk booking ini', 404);
    if (mm.checkedIn) return res.json({ ok: true, data: mm }); // idempotent

    const up = await prisma.bookingMember.update({
      where: { id: memberId },
      data: { checkedIn: true, checkedInAt: new Date() },
    });

    res.json({ ok: true, data: up });
  });
}
