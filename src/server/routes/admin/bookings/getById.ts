// src/server/routes/admin/bookings/getById.ts
import { Router } from 'express';
import { prisma } from '@server/libs/prisma'; // atau { db } kalau kamu pakai alias itu
import { AppError } from '../../../utils/app-error';

export default function registerGetById(r: Router) {
  r.get('/:id', async (req, res) => {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        trail: true,
        slot: true,
        members: { orderBy: { createdAt: 'asc' } },
        payment: true,
      },
    });
    if (!booking) throw new AppError('Booking tidak ditemukan', 404); // ← diperbaiki
    res.json({ ok: true, data: booking });
  });
}
