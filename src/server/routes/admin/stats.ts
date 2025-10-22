// src/server/routes/admin/stats.ts
import { Router } from 'express';
import { prisma as db } from '@server/libs/prisma';

const r = Router();

// GET /api/admin/stats
r.get('/stats', async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [pending, paid, today, revenueAgg] = await Promise.all([
    db.booking.count({ where: { status: 'PENDING' } }),
    db.booking.count({ where: { status: 'PAID' } }),
    db.booking.count({ where: { createdAt: { gte: startOfToday } } }),
    db.payment.aggregate({ _sum: { grossAmount: true }, where: { transactionStatus: 'settlement' } }),
  ]);

  res.json({
    pending,
    paid,
    today,
    revenue: revenueAgg._sum.grossAmount ?? 0,
  });
});

export default r;
