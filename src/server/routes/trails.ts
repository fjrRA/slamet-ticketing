// src/server/routes/trails.ts
import { Router } from 'express';
import { prisma } from '@server/libs/prisma';
import { AppError } from '@server/utils/app-error';
import type { Prisma } from '@prisma/client';

const r = Router();

function parseISODateOrThrow(s?: string) {
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new AppError('Tanggal tidak valid', 400);
  return d;
}

// helper parse active
function parseActive(q: unknown) {
  const a = String(q ?? '').toLowerCase();
  if (a === '1' || a === 'true') return true;
  if (a === '0' || a === 'false') return false;
  return undefined;
}

// === PUBLIC LIST (object shape) ===
// GET /api/trails?active=1
r.get('/', async (req, res) => {
  const active = parseActive(req.query.active);
  const trails = await prisma.trail.findMany({
    where: active === undefined ? {} : { isActive: active },
    orderBy: { name: 'asc' },
    select: {
      id: true, name: true, mountainName: true,
      basecamp: true, basecampCode: true, isActive: true,
    }
  });
  res.json({ ok: true, data: trails });
});

// === PUBLIC LIST (array shape; BACKWARD-COMPAT) ===
// GET /api/trails/list?active=1
r.get('/list', async (req, res) => {
  const active = parseActive(req.query.active);
  const trails = await prisma.trail.findMany({
    where: active === undefined ? {} : { isActive: active },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, basecamp: true, basecampCode: true, isActive: true },
  });
  res.json(trails); // ← array langsung untuk komponen lama
});

// GET /api/trails/:id/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
r.get('/:id/slots', async (req, res, next) => {
  try {
    const { id } = req.params;
    const from = parseISODateOrThrow(req.query.from as string | undefined);
    const to   = parseISODateOrThrow(req.query.to as string | undefined);

    let where: Prisma.TimeSlotWhereInput = { trailId: id };
    if (from && to) where = { ...where, date: { gte: from, lte: to } };

    const slots = await prisma.timeSlot.findMany({
      where,
      orderBy: { date: 'asc' },
      select: { id: true, date: true, quotaTotal: true, quotaReserved: true, quotaPaid: true }
    });

    res.json({
      ok: true,
      data: slots.map(s => ({
        ...s,
        remaining: s.quotaTotal - s.quotaReserved - s.quotaPaid
      }))
    });
  } catch (e) { next(e); }
});

// GET /api/trails/:id/prices?on=YYYY-MM-DD
r.get('/:id/prices', async (req, res, next) => {
  try {
    const { id } = req.params;
    const on = parseISODateOrThrow(req.query.on as string | undefined) ?? new Date();
    const price = await prisma.price.findFirst({
      where: { trailId: id, startDate: { lte: on }, endDate: { gte: on } },
      orderBy: [{ startDate: 'desc' }]
    });
    res.json({ ok: true, data: price || null });
  } catch (e) { next(e); }
});

export default r;
