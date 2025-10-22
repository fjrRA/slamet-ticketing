// src/server/routes/admin/users/update.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(6).nullable().optional(),
});

export default function registerUpdate(r: Router) {
  r.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const body = bodySchema.parse(req.body);

    const saved = await prisma.user.update({
      where: { id },
      data: {
        ...(typeof body.name === 'string' ? { name: body.name } : {}),
        ...(typeof body.phone !== 'undefined' ? { phone: body.phone } : {}),
      },
      include: { _count: { select: { bookings: true } } },
    });
    res.json({ ok: true, data: saved });
  });
}
