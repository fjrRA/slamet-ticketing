// src/server/routes/admin/closures/list.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../libs/prisma';
import { Prisma } from '@prisma/client';

export default function registerList(r: Router) {
  const handler = (req: Request, res: Response, next: NextFunction) => {
    // bungkus async agar tipe = void, bukan Promise<void>
    (async () => {
      const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
      const pageSize = Math.min(Math.max(parseInt((req.query.pageSize as string) || '20', 10), 1), 100);
      const trailId = (req.query.trailId as string | undefined) || undefined;

      let from = (req.query.from as string | undefined) || undefined;
      let to   = (req.query.to   as string | undefined) || undefined;

      // support: days=7 (override from/to)
      const daysRaw = req.query.days as string | undefined;
      const daysNum = daysRaw ? parseInt(daysRaw, 10) : NaN;
      if (!Number.isNaN(daysNum) && daysNum > 0) {
        const now = new Date();
        const until = new Date(now);
        until.setDate(now.getDate() + daysNum);
        from = now.toISOString();
        to = until.toISOString();
      }

      const where: Prisma.ClosureWhereInput = {
        ...(trailId ? { trailId } : {}),
        ...(from || to
          ? { date: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
          : {}),
      };

      const [total, raw] = await Promise.all([
        prisma.closure.count({ where }),
        prisma.closure.findMany({
          where,
          orderBy: { date: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: { trail: { select: { id: true, name: true } } },
        }),
      ]);

      const items = await Promise.all(
        raw.map(async (c) => {
          const bookingCount = await prisma.booking.count({
            where: { trailId: c.trailId, slot: { date: c.date } },
          });
          return { ...c, bookingCount };
        })
      );

      res.json({ page, pageSize, total, items });
    })().catch(next);
  };

  // aktifkan dua path
  r.get('/', handler);
  r.get('/list', handler);
}
