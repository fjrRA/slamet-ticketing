// src/server/routes/admin/slots/updateQuota.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { updateQuotaBody, ensureQuotaOK } from './helpers';

export default function registerUpdateQuota(r: Router) {
  // PATCH /api/admin/slots/:id
  r.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { quotaTotal } = updateQuotaBody.parse(req.body);

      await ensureQuotaOK(id, quotaTotal);

      const saved = await prisma.timeSlot.update({
        where: { id },
        data: { quotaTotal },
        include: { trail: { select: { id: true, name: true } } },
      });

      res.json({ ok: true, data: saved });
    } catch (e) { next(e); }
  });
}
