// src/server/routes/admin/trails/list.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../libs/prisma';
import { Prisma } from '@prisma/client';

export default function registerList(r: Router) {
  const handler = (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
      const pageSize = Math.min(Math.max(parseInt((req.query.pageSize as string) || '20', 10), 1), 100);
      const q = (req.query.q as string | undefined)?.trim();

      // support active=1|0|true|false
      const a = String(req.query.active ?? '').toLowerCase();
      const active =
        a === '1' || a === 'true' ? true :
        a === '0' || a === 'false' ? false :
        undefined;

      const where: Prisma.TrailWhereInput = {};
      if (q) {
        where.OR = [
          { name: { contains: q } },
          { mountainName: { contains: q } },
          { basecamp: { contains: q } },
        ];
      }
      if (active !== undefined) where.isActive = active;

      const [total, items] = await Promise.all([
        prisma.trail.count({ where }),
        prisma.trail.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: { _count: { select: { slots: true, bookings: true } } },
        }),
      ]);

      res.json({ page, pageSize, total, items });
    })().catch(next);
  };

  r.get('/', handler);
  r.get('/list', handler);
}
