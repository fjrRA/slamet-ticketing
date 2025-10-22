// src/server/routes/admin/prices/helpers.ts
import { z } from 'zod';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';

export const createBody = z.object({
  trailId: z.string().cuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  priceLocal: z.number().int().nonnegative(),
  priceNonLocal: z.number().int().nonnegative(),
  weekendMultiplier: z.number().min(1).default(1),
  seasonLabel: z.string().trim().optional().nullable(),
});

export const patchBody = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  priceLocal: z.number().int().nonnegative().optional(),
  priceNonLocal: z.number().int().nonnegative().optional(),
  weekendMultiplier: z.number().min(1).optional(),
  seasonLabel: z.string().trim().optional().nullable(),
});

export const qList = z.object({
  trailId: z.string().cuid().optional(),
  from: z.string().optional(), // 'YYYY-MM-DD'
  to: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export function ymd(s: string) {
  return new Date(s + 'T00:00:00Z'); // simpan tepat tanggal (kolom @db.Date)
}

export function assertStartLeEnd(start: Date, end: Date) {
  if (start > end) throw new AppError('startDate harus <= endDate', 400);
}

export async function assertNoOverlap(
  trailId: string,
  start: Date,
  end: Date,
  excludeId?: string,
) {
  const where = {
    trailId,
    startDate: { lte: end },
    endDate: { gte: start },
    ...(excludeId ? { id: { not: excludeId } } : {}),
  };
  const overlap = await prisma.price.count({ where });
  if (overlap > 0) {
    throw new AppError('Rentang tanggal bertabrakan dengan harga lain untuk trail ini', 400);
  }
}
