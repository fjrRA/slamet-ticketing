// src/server/routes/admin/slots/list.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { qList } from './helpers';
import { Prisma } from '@prisma/client';

export default function registerList(r: Router) {
  r.get('/', async (req, res, next) => {
    try {
      const q = qList.parse(req.query);
      const where: Prisma.TimeSlotWhereInput = {
        ...(q.trailId ? { trailId: q.trailId } : {}),
        ...(q.from || q.to
          ? {
              date: {
                ...(q.from ? { gte: new Date(q.from) } : {}),
                ...(q.to ? { lte: new Date(q.to) } : {}),
              },
            }
          : {}),
      };

      const [total, items] = await Promise.all([
        prisma.timeSlot.count({ where }),
        prisma.timeSlot.findMany({
          where,
          orderBy: { date: 'asc' },
          skip: (q.page - 1) * q.pageSize,
          take: q.pageSize,
          include: {
            trail: { select: { id: true, name: true } },
            _count: { select: { bookings: true } },
          },
        }),
      ]);

      res.json({ page: q.page, pageSize: q.pageSize, total, items });
    } catch (e) { next(e); }
  });
}
