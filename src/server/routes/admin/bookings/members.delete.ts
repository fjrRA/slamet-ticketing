// src/server/routes/admin/bookings/members.delete.ts
 import { Router } from 'express';
 import { prisma } from '../../../libs/prisma';
 import { AppError } from '../../../utils/app-error';

export default function registerMemberDelete(r: Router) {
  r.delete('/:id/members/:memberId', async (req, res) => {
  const { id, memberId } = req.params;

  const bk = await prisma.booking.findUnique({ where: { id }, select: { status: true } });
  if (!bk) throw new AppError('Booking tidak ditemukan', 404);
  if (bk.status === 'CANCELLED') throw new AppError('Booking CANCELLED — anggota tidak boleh diubah', 400);

  const mm = await prisma.bookingMember.findUnique({ where: { id: memberId } });
  if (!mm) throw new AppError('Anggota tidak ditemukan', 404);
  if (mm.bookingId !== id) throw new AppError('Anggota tidak ditemukan untuk booking ini', 404);
  if (mm.checkedIn) throw new AppError('Tidak bisa menghapus anggota yang sudah check-in', 400);

    await prisma.bookingMember.delete({ where: { id: memberId }});
    res.json({ ok: true });
  });
}
