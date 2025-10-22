// src/server/routes/admin/trails/toggleActive.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';

export default function registerToggle(r: Router) {
  r.patch('/:id/active', async (req, res) => {
    const { id } = req.params;
    const { isActive } = (req.body ?? {}) as { isActive: boolean };
    const saved = await prisma.trail.update({ where: { id }, data: { isActive: !!isActive } });
    res.json({ ok: true, data: saved });
  });
}
