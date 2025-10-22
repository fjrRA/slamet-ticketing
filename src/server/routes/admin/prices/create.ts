// src/server/routes/admin/prices/create.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { createBody, ymd, assertStartLeEnd, assertNoOverlap } from './helpers';

export default function registerCreate(r: Router) {
  r.post('/', async (req, res, next) => {
    try {
      const body = createBody.parse(req.body);
      const start = ymd(body.startDate);
      const end = ymd(body.endDate);
      assertStartLeEnd(start, end);

      const trail = await prisma.trail.findUnique({ where: { id: body.trailId } });
      if (!trail) throw new AppError('Trail tidak ditemukan', 404);

      await assertNoOverlap(body.trailId, start, end);

      const saved = await prisma.price.create({
        data: {
          trailId: body.trailId,
          startDate: start,
          endDate: end,
          priceLocal: body.priceLocal,
          priceNonLocal: body.priceNonLocal,
          weekendMultiplier: body.weekendMultiplier ?? 1,
          seasonLabel: body.seasonLabel ?? null,
        },
      });

      res.status(201).json({ ok: true, data: saved });
    } catch (e) { next(e); }
  });
}
