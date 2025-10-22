// src/server/routes/admin/prices/list.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { qList } from './helpers';
import type { Prisma } from '@prisma/client';

export default function registerList(r: Router) {
  r.get('/', async (req, res, next) => {
    try {
      const q = qList.parse(req.query);
      const where: Prisma.PriceWhereInput = {
        ...(q.trailId ? { trailId: q.trailId } : {}),
        ...(q.from || q.to
          ? {
              AND: [{
                startDate: q.to ? { lte: new Date(q.to) } : undefined,
              }, {
                endDate: q.from ? { gte: new Date(q.from) } : undefined,
              }],
            }
          : {}),
      };

      const [total, items] = await Promise.all([
        prisma.price.count({ where }),
        prisma.price.findMany({
          where,
          orderBy: [{ trailId: 'asc' }, { startDate: 'asc' }],
          skip: (q.page - 1) * q.pageSize,
          take: q.pageSize,
          include: { trail: { select: { id: true, name: true } } },
        }),
      ]);

      res.json({ page: q.page, pageSize: q.pageSize, total, items });
    } catch (e) { next(e); }
  });
}
