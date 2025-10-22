// src/server/routes/admin/closures/create.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { createBody, toDate } from './helpers';
import { Prisma } from '@prisma/client';

export default function registerCreate(r: Router) {
  r.post('/', async (req, res) => {
    const body = createBody.parse(req.body);
    const date = toDate(body.date);

    const relatedBookings = await prisma.booking.count({
      where: { trailId: body.trailId, slot: { date } },
    });
    if (relatedBookings > 0 && !body.force) {
      throw new AppError(
        `Tanggal ini sudah memiliki ${relatedBookings} booking. Gunakan "force" untuk menutup paksa.`,
        400,
      );
    }

    try {
      const saved = await prisma.closure.create({
        data: { trailId: body.trailId, date, reason: body.reason ?? undefined },
        include: { trail: { select: { id: true, name: true } } },
      });
      res.json({ ok: true, data: { ...saved, bookingCount: relatedBookings } });
    } catch (e: unknown) {
     if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new AppError('Trail & tanggal ini sudah ditutup.', 400);
      }
      throw e;
    }
  });
}
