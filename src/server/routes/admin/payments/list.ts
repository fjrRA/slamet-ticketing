// src/server/routes/admin/payments/list.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';

export default function registerList(r: Router) {
  // GET /api/admin/payments?q=&status=&from=&to=&page=&pageSize=
  r.get('/', async (req, res) => {
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt((req.query.pageSize as string) || '20', 10), 1), 100);
    const q = (req.query.q as string | undefined)?.trim();
    const status = (req.query.status as string | undefined)?.trim();
    const from = (req.query.from as string | undefined) || undefined;
    const to   = (req.query.to as string | undefined) || undefined;

    const where = {
      ...(status ? { transactionStatus: status } : {}),
      ...(from || to
        ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
        : {}),
      ...(q
        ? {
            OR: [
              { transactionId: { contains: q } },
              { booking: { orderId: { contains: q } } },
              { booking: { user: { name: { contains: q } } } },
              { booking: { user: { email: { contains: q } } } },
            ],
          }
        : {}),
    } as const;

    const [total, items] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          booking: {
            select: {
              id: true, orderId: true, status: true,
              user: { select: { id: true, name: true, email: true } },
              trail: { select: { id: true, name: true } },
              slot:  { select: { date: true } },
            },
          },
        },
      }),
    ]);

    res.json({ page, pageSize, total, items });
  });
}
