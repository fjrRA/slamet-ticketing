// src/server/routes/admin/trails/create.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
import { trailCreateBody } from './helpers';

export default function registerCreate(r: Router) {
  r.post('/', async (req, res, next) => {         // ⬅ bungkus try/catch → next(e)
    try {
      const data = trailCreateBody.parse(req.body);

      const exist = await prisma.trail.findUnique({ where: { name: data.name } });
      if (exist) throw new AppError('Nama jalur sudah digunakan', 400);

      const created = await prisma.trail.create({ data });
      res.status(201).json({ ok: true, data: created });
    } catch (e) {
      next(e); // biar middleware error kamu mengubah ke 400 kalau ZodError
    }
  });
}
