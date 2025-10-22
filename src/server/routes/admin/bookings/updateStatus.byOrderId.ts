// src/server/routes/admin/bookings/updateStatus.byOrderId.ts
import { Router } from 'express';
import { BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { applySlotDelta, transitionDelta } from './helpers';

export default function registerUpdateStatus(r: Router) {
  // PUT /api/admin/bookings/:orderId/status { status: "PAID" | ... }
  r.put('/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body as { status: BookingStatus };

    if (!status || !Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const current = await tx.booking.findUnique({
        where: { orderId },
        include: { slot: true },
      });
      if (!current) throw new AppError('Booking tidak ditemukan', 404);

      if (current.status !== status) {
        const { reserved, paid } = transitionDelta(current.status, status);
        const ps = current.partySize;
        await applySlotDelta(tx, current.slotId, reserved * ps, paid * ps);
      }

      return tx.booking.update({
        where: { orderId },
        data: { status },
        include: { user: true, trail: true, slot: true, payment: true },
      });
    });

    res.json({ ok: true, booking: updated });
  });
}
