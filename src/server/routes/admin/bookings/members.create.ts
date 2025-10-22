// src/server/routes/admin/bookings/members.create.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../../../utils/app-error';
import { memberCreate } from './helpers';

export default function registerMemberCreate(r: Router) {
  r.post('/:id/members', async (req, res) => {
    const { id } = req.params;
    const body = memberCreate.parse(req.body);

    const out = await prisma.$transaction(async (tx) => {
      const bk = await tx.booking.findUnique({
        where: { id },
        include: { members: true },
      });
      if (!bk) throw new AppError('Booking tidak ditemukan', 404);
      if (bk.status === 'CANCELLED') throw new AppError('Tidak bisa menambah anggota pada booking CANCELLED', 400);
      if (bk.members.length >= bk.partySize) {
        throw new AppError(`Jumlah anggota sudah memenuhi partySize (${bk.partySize})`, 400);
      }

      const created = await tx.bookingMember.create({
        data: {
          bookingId: id,
          fullName: body.fullName,
          idNumber: body.idNumber,
          birthdate: body.birthdate ? new Date(body.birthdate) : null,
          gender: body.gender ?? null,
          city: body.city ?? null,
        },
      });
      return created;
    });

    res.json({ ok: true, data: out });
  }, (e) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new AppError('Anggota dengan nomor identitas ini sudah ada di booking ini.', 409);
    }
    throw e;
  });
}
