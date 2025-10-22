// src/server/routes/admin/prices/delete.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';

export default function registerDelete(r: Router) {
  r.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.price.delete({ where: { id } }).catch(() => {});
      res.json({ ok: true });
    } catch (e) { next(e); }
  });
}
