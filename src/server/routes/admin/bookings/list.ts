// src/server/routes/admin/bookings/list.ts
import { Router } from 'express';
import { Prisma, BookingStatus } from '@prisma/client';
import { prisma } from '../../../libs/prisma';

export default function registerList(r: Router) {
  // GET /api/admin/bookings?status=&q=&page=&pageSize=
  r.get('/', async (req, res) => {
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt((req.query.pageSize as string) || '20', 10), 1), 100);
    const status = req.query.status as BookingStatus | undefined;
    const q = (req.query.q as string | undefined)?.trim();

    const where: Prisma.BookingWhereInput = {
      ...(status ? { status } : {}),
      ...(q ? {
        OR: [
          { orderId: { contains: q } },
          { user:  { name:  { contains: q } } },
          { trail: { name:  { contains: q } } },
        ],
      } : {}),
    };

    const [total, items] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: { user: true, trail: true, slot: true, payment: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    res.json({ page, pageSize, total, items });
  });
}
