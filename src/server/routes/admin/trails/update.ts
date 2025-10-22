// src/server/routes/admin/trails/update.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { trailUpdateBody } from './helpers';

export default function registerUpdate(r: Router) {
  r.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const data = trailUpdateBody.parse(req.body);

    if (data.name) {
      const dup = await prisma.trail.findUnique({ where: { name: data.name } });
      if (dup && dup.id !== id) throw new AppError('Nama jalur sudah digunakan', 400);
    }

    const saved = await prisma.trail.update({ where: { id }, data });
    res.json({ ok: true, data: saved });
  });
}
