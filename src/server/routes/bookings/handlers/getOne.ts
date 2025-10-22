// src/server/routes/bookings/handlers/getOne.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';

export const getBookingByOrderId: RequestHandler = async (req, res) => {
  const { orderId } = req.params;
  const data = await prisma.booking.findUnique({
    where: { orderId },
    include: {
      members: true,
      payment: true,
      slot: { select: { date: true } },
      trail: { select: { name: true } },
    },
  });
  if (!data) return res.status(404).json({ ok: false, message: 'Not found' });
  res.json({ ok: true, data });
};
