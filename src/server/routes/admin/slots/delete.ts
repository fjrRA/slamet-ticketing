// src/server/routes/admin/slots/delete.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';

export default function registerDelete(r: Router) {
  // DELETE /api/admin/slots/:id
  r.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const slot = await prisma.timeSlot.findUnique({
        where: { id },
        include: { _count: { select: { bookings: true } } },
      });
      if (!slot) return res.status(204).end();
      if (slot._count.bookings > 0) {
        throw new AppError('Tidak bisa hapus: slot memiliki booking', 400);
      }
      await prisma.timeSlot.delete({ where: { id } });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });
}
