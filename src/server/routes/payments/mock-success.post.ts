// src/server/routes/payments/mock-success.post.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';

export const postMockSuccess: RequestHandler = async (req, res) => {
  const { orderId } = (req.body ?? {}) as { orderId?: string };
  if (!orderId) return res.status(400).json({ ok: false, message: 'orderId wajib' });

  const booking = await prisma.booking.findUnique({
    where: { orderId },
    select: { id: true, slotId: true, partySize: true },
  });
  if (!booking) return res.status(404).json({ ok: false, message: 'Order tidak ditemukan' });

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        transactionId: 'mock_' + Date.now(),
        paymentType: 'mock',
        transactionStatus: 'settlement',
        fraudStatus: 'accept',
        signatureKey: 'mock',
        rawNotif: { mock: true },
        settledAt: new Date(),
      },
      create: {
        bookingId: booking.id,
        grossAmount: 0,
        transactionId: 'mock_' + Date.now(),
        paymentType: 'mock',
        transactionStatus: 'settlement',
        fraudStatus: 'accept',
        signatureKey: 'mock',
        rawNotif: { mock: true },
        settledAt: new Date(),
      },
    });
    await tx.timeSlot.update({
      where: { id: booking.slotId },
      data: { quotaPaid: { increment: booking.partySize }, quotaReserved: { decrement: booking.partySize } },
    });
    await tx.booking.update({ where: { id: booking.id }, data: { status: 'PAID' } });
  });

  res.json({ ok: true, message: 'Mock payment success' });
};
