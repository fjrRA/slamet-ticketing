// src/server/routes/bookings/handlers/getMe.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';

export const getMyBookings: RequestHandler = async (req, res, next) => {
  try {
    const list = await prisma.booking.findMany({
      where: { userId: req.auth!.uid },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderId: true,
        status: true,
        total: true,
        createdAt: true,
        slot: { select: { date: true } },
        trail: { select: { name: true } },
      },
    });
    res.json({ ok: true, data: list });
  } catch (e) { next(e); }
};
