// src/server/routes/admin/slots/bulk.create.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { bulkBody, ymdToDate } from './helpers';

export default function registerBulkCreate(r: Router) {
  // POST /api/admin/slots/:trailId/bulk
  r.post('/:trailId/bulk', async (req, res, next) => {
    try {
      const { trailId } = req.params;
      const body = bulkBody.parse(req.body);

      const trail = await prisma.trail.findUnique({ where: { id: trailId } });
      if (!trail) throw new AppError('Trail tidak ditemukan', 404);

      const data = body.dates.map(d => ({
        trailId,
        date: ymdToDate(d),
        quotaTotal: body.quotaTotal,
      }));

      // createMany + skipDuplicates hormati unique (trailId,date)
      const result = await prisma.timeSlot.createMany({
        data,
        skipDuplicates: true,
      });

      res.status(201).json({ ok: true, inserted: result.count });
    } catch (e) { next(e); }
  });
}
