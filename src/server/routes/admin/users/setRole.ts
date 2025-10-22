// src/server/routes/admin/users/setRole.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { z } from 'zod';
import { AppError } from '../../../utils/app-error';

const bodySchema = z.object({ role: z.enum(['USER', 'ADMIN']) });

export default function registerSetRole(r: Router) {
  r.put('/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = bodySchema.parse(req.body);

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new AppError('User tidak ditemukan', 404);

    if (target.role === 'ADMIN' && role === 'USER') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) throw new AppError('Tidak bisa menurunkan role admin terakhir', 400);
    }

    const saved = await prisma.user.update({
      where: { id },
      data: { role },
      include: { _count: { select: { bookings: true } } },
    });
    res.json({ ok: true, data: saved });
  });
}
