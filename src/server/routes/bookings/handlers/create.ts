// src/server/routes/bookings/handlers/create.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';
import { AppError } from '@server/utils/app-error';
import { calcTotal } from '@server/services/pricing.service';
import { createBookingSchema } from '../schemas';
import { generateOrderId } from '../helpers';

export const createBooking: RequestHandler = async (req, res, next) => {
  try {
    const body = createBookingSchema.parse(req.body);
    const { trailId, slotId, partySize, members, isNonLocal, note } = body;

    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
      select: { id: true, date: true, trailId: true },
    });
    if (!slot || slot.trailId !== trailId) throw new AppError('Slot tidak valid', 400);

    const { total } = await calcTotal(trailId, slot.date, partySize, !!isNonLocal);

    const booking = await prisma.$transaction(async (tx) => {
      // 1) Reserve kuota
      const affected = await tx.$executeRaw`
        UPDATE TimeSlot
           SET quotaReserved = quotaReserved + ${partySize}
         WHERE id = ${slotId}
           AND (quotaTotal - quotaReserved - quotaPaid) >= ${partySize}
      `;
      if (affected === 0) throw new AppError('Kuota tidak cukup', 409);

      // 2) Buat booking + anggota
      const created = await tx.booking.create({
        data: {
          orderId: generateOrderId(slotId),
          userId: req.auth!.uid,
          trailId,
          slotId,
          partySize,
          total,
          note: note ?? null,
          members: {
            createMany: {
              data: members.map(m => ({
                fullName: m.fullName,
                idNumber: m.idNumber,
                birthdate: m.birthdate ? new Date(m.birthdate) : null,
                gender: m.gender ?? null,
                city: m.city ?? null,
              })),
            },
          },
        },
        select: {
          id: true, orderId: true, status: true, total: true,
          slot: { select: { date: true } },
          trail: { select: { name: true } },
        },
      });

      // 3) Payment placeholder
      await tx.payment.upsert({
        where: { bookingId: created.id },
        update: { grossAmount: total, transactionStatus: 'pending' },
        create: { bookingId: created.id, grossAmount: total, transactionStatus: 'pending' },
      });

      return created;
    });

    res.status(201).json({ ok: true, data: booking });
  } catch (e) { next(e); }
};
