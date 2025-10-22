// src/server/routes/admin/bookings/patchBooking.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { patchBody, transitionDelta, applySlotDelta } from './helpers';
import { Prisma } from '@prisma/client'; // ⬅️ tambahkan ini

export default function registerPatchBooking(r: Router) {
  r.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const body = patchBody.parse(req.body);

    const out = await prisma.$transaction(async (tx /*: Prisma.TransactionClient*/) => {
      const current = await tx.booking.findUnique({
        where: { id },
        include: { slot: true },
      });
      if (!current) throw new AppError('Booking tidak ditemukan', 404);

      // ⬇️ ganti any
      const updates: Partial<Prisma.BookingUpdateInput> = {};
      let slotReservedDelta = 0;
      let slotPaidDelta = 0;

      if (typeof body.partySize === 'number' && body.partySize !== current.partySize) {
        if (current.status !== 'PENDING') {
          throw new AppError('partySize hanya bisa diubah saat status PENDING', 400);
        }
        const diff = body.partySize - current.partySize;
        slotReservedDelta += diff;
        updates.partySize = body.partySize;
      }

      if (body.status) {
        const { reserved, paid } = transitionDelta(current.status, body.status);
        const ps = (updates.partySize as number | undefined) ?? current.partySize;
        slotReservedDelta += reserved * ps;
        slotPaidDelta     += paid     * ps;
        updates.status = body.status;
      }

      if ('note' in body) updates.note = body.note ?? null;

      await applySlotDelta(tx, current.slotId, slotReservedDelta, slotPaidDelta);

      const saved = await tx.booking.update({
        where: { id },
        data: updates,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          trail: true, slot: true, members: true, payment: true,
        },
      });

      return saved;
    });

    res.json({ ok: true, data: out });
  });
}
