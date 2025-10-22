// src/server/routes/admin/checkin.ts
import { Router } from 'express';
import { prisma } from '@server/libs/prisma';
import { adminGate } from '@server/middlewares/admin/admin-gate';

const r = Router();

r.post('/bookings/:orderId/checkin', adminGate, async (req, res) => {
  const { orderId } = req.params;

  const b = await prisma.booking.findUnique({
    where: { orderId },
    select: { id: true, status: true, checkedInAt: true },
  });
  if (!b) return res.status(404).json({ ok:false, message:'Order tidak ditemukan' });
  if (b.status !== 'PAID') return res.status(400).json({ ok:false, message:'Belum dibayar' });
  if (b.checkedInAt) return res.status(409).json({ ok:false, message:'Sudah check-in' });

  await prisma.booking.update({
    where: { id: b.id },
    data: { checkedInAt: new Date(), checkedInBy: req.auth!.uid },
  });

  res.json({ ok:true });
});

export default r;
