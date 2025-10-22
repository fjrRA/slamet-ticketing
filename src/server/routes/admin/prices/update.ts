// src/server/routes/admin/prices/update.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { patchBody, ymd, assertStartLeEnd, assertNoOverlap } from './helpers';

export default function registerUpdate(r: Router) {
  r.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = patchBody.parse(req.body);

      const cur = await prisma.price.findUnique({ where: { id } });
      if (!cur) throw new AppError('Price tidak ditemukan', 404);

      const nextStart = payload.startDate ? ymd(payload.startDate) : cur.startDate;
      const nextEnd   = payload.endDate   ? ymd(payload.endDate)   : cur.endDate;

      assertStartLeEnd(nextStart, nextEnd);
      await assertNoOverlap(cur.trailId, nextStart, nextEnd, id);

      const saved = await prisma.price.update({
        where: { id },
        data: {
          startDate: nextStart,
          endDate: nextEnd,
          priceLocal: payload.priceLocal ?? cur.priceLocal,
          priceNonLocal: payload.priceNonLocal ?? cur.priceNonLocal,
          weekendMultiplier: payload.weekendMultiplier ?? cur.weekendMultiplier,
          seasonLabel: payload.seasonLabel ?? cur.seasonLabel,
        },
      });

      res.json({ ok: true, data: saved });
    } catch (e) { next(e); }
  });
}
