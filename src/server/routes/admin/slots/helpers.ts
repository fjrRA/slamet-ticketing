// src/server/routes/admin/slots/helpers.ts
import { z } from 'zod';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';

export const qList = z.object({
  trailId: z.string().cuid().optional(),
  from: z.string().optional(), // 'YYYY-MM-DD'
  to: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const bulkBody = z.object({
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1), // list Y-M-D
  quotaTotal: z.number().int().positive(),
});

export const updateQuotaBody = z.object({
  quotaTotal: z.number().int().positive(),
});

/** Pastikan quotaTotal ≥ reserved + paid */
export async function ensureQuotaOK(slotId: string, nextTotal: number) {
  const s = await prisma.timeSlot.findUnique({ where: { id: slotId } });
  if (!s) throw new AppError('Slot tidak ditemukan', 404);
  if (s.quotaReserved + s.quotaPaid > nextTotal) {
    throw new AppError('quotaTotal lebih kecil dari (reserved + paid)', 400);
  }
}

/** Parse Y-M-D -> Date (UTC) aman untuk kolom @db.Date */
export function ymdToDate(s: string) {
  // Pastikan tersimpan sebagai 00:00 UTC; MySQL @db.Date akan simpan tanggalnya saja
  return new Date(s + 'T00:00:00Z');
}
