// src/server/routes/admin/users/list.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import type { Prisma } from '@prisma/client';

export default function registerList(r: Router) {
  r.get('/', async (req, res) => {
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt((req.query.pageSize as string) || '20', 10), 1), 100);
    const q = (req.query.q as string | undefined)?.trim();

    const where: Prisma.UserWhereInput = q
      ? {
          OR: [
            { name:  { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { bookings: true } } },
      }),
    ]);

    res.json({ page, pageSize, total, items });
  });
}
