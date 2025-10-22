// src/server/routes/admin/trails/delete.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';

export default function registerDelete(r: Router) {
  r.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const t = await prisma.trail.findUnique({
      where: { id },
      include: { _count: { select: { slots: true, bookings: true } } },
    });
    if (!t) throw new AppError('Trail tidak ditemukan', 404);

    if (t._count.slots > 0 || t._count.bookings > 0) {
      throw new AppError('Tidak bisa dihapus: sudah memiliki Slot atau Booking. Arsipkan saja.', 400);
    }

    // Harga & Closure akan ikut terhapus (onDelete: Cascade) — sesuai schema kamu.
    await prisma.trail.delete({ where: { id } });
    res.json({ ok: true });
  });
}
