// src/server/routes/admin/closures/update.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
// src/server/routes/admin/closures/update.ts
import { AppError } from '../../../utils/app-error';
import { updateBody } from './helpers';

export default function registerUpdate(r: Router) {
  r.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const body = updateBody.parse(req.body);

    const found = await prisma.closure.findUnique({ where: { id } });
    if (!found) throw new AppError('Closure tidak ditemukan', 404);

    const saved = await prisma.closure.update({
      where: { id },
      data: { reason: body.reason ?? null },
      include: { trail: { select: { id: true, name: true } } },
    });
    res.json({ ok: true, data: saved });
  });
}
