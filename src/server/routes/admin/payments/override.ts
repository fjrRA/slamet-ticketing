// src/server/routes/admin/payments/override.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { applySlotDelta, transitionDelta } from '../bookings/helpers';
import { BookingStatus, Prisma } from '@prisma/client';

export default function registerOverride(r: Router) {
  // POST /api/admin/payments/:id/mark-paid
  r.post('/:id/mark-paid', async (req, res) => {
    const { id } = req.params;

    const out = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const pay = await tx.payment.findUnique({
        where: { id },
        include: { booking: { include: { slot: true } } },
      });
      if (!pay) throw new AppError('Payment tidak ditemukan', 404);

      // update booking -> PAID (jika belum)
      if (pay.booking.status !== BookingStatus.PAID) {
        const { reserved, paid } = transitionDelta(pay.booking.status, BookingStatus.PAID);
        await applySlotDelta(tx, pay.booking.slotId, reserved * pay.booking.partySize, paid * pay.booking.partySize);
        await tx.booking.update({ where: { id: pay.bookingId }, data: { status: BookingStatus.PAID } });
      }

      const saved = await tx.payment.update({
        where: { id },
        data: { transactionStatus: 'settlement', settledAt: new Date() },
        include: {
          booking: {
            select: {
              id: true, orderId: true, status: true,
              user: { select: { id: true, name: true, email: true } },
              trail: { select: { id: true, name: true } },
              slot:  { select: { date: true } },
            },
          },
        },
      });
      return saved;
    });

    res.json({ ok: true, data: out });
  });

  // POST /api/admin/payments/:id/mark-refunded
  r.post('/:id/mark-refunded', async (req, res) => {
    const { id } = req.params;

    const out = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const pay = await tx.payment.findUnique({
        where: { id },
        include: { booking: { include: { slot: true } } },
      });
      if (!pay) throw new AppError('Payment tidak ditemukan', 404);

      // booking -> REFUNDED (hanya dari PAID yang valid)
      if (pay.booking.status !== BookingStatus.REFUNDED) {
        const { reserved, paid } = transitionDelta(pay.booking.status, BookingStatus.REFUNDED);
        await applySlotDelta(tx, pay.booking.slotId, reserved * pay.booking.partySize, paid * pay.booking.partySize);
        await tx.booking.update({ where: { id: pay.bookingId }, data: { status: BookingStatus.REFUNDED } });
      }

      const saved = await tx.payment.update({
        where: { id },
        data: { transactionStatus: 'refund', settledAt: new Date() },
        include: {
          booking: {
            select: {
              id: true, orderId: true, status: true,
              user: { select: { id: true, name: true, email: true } },
              trail: { select: { id: true, name: true } },
              slot:  { select: { date: true } },
            },
          },
        },
      });
      return saved;
    });

    res.json({ ok: true, data: out });
  });
}
