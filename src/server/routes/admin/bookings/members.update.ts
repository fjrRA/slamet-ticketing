// src/server/routes/admin/bookings/members.update.ts
 import { Router } from 'express';
 import { prisma } from '../../../libs/prisma';
 import { memberPatch } from './helpers';
import { AppError } from '../../../utils/app-error';
import { Prisma } from '@prisma/client';

export default function registerMemberUpdate(r: Router) {
  r.patch('/:id/members/:memberId', async (req, res) => {
  const { id, memberId } = req.params;
    const body = memberPatch.parse(req.body);

  const bk = await prisma.booking.findUnique({ where: { id }, select: { status: true } });
  if (!bk) throw new AppError('Booking tidak ditemukan', 404);
  if (bk.status === 'CANCELLED') throw new AppError('Booking CANCELLED — anggota tidak boleh diubah', 400);

  const mm = await prisma.bookingMember.findUnique({ where: { id: memberId } });
  if (!mm || mm.bookingId !== id) throw new AppError('Anggota tidak ditemukan untuk booking ini', 404);

  let updated;
  try {
    updated = await prisma.bookingMember.update({
      where: { id: memberId },
      data: {
        fullName: body.fullName ?? undefined,
        idNumber: body.idNumber ?? undefined,
        birthdate: body.birthdate ? new Date(body.birthdate) : undefined,
        gender: body.gender ?? undefined,
        city: body.city ?? undefined,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new AppError('Anggota dengan nomor identitas ini sudah ada di booking ini.', 409);
    }
    throw e;
  }

    res.json({ ok: true, data: updated });
  });
}
