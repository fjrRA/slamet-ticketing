// src/server/routes/admin/closures/delete.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';

export default function registerDelete(r: Router) {
  r.delete('/:id', async (req, res) => {
    await prisma.closure.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  });
}
