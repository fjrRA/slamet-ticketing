// src/server/routes/admin/closures/helpers.ts
import { z } from 'zod';

export const listQuery = z.object({
  trailId: z.string().min(1).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const createBody = z.object({
  trailId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  reason: z.string().trim().nullable().optional(),
  force: z.boolean().optional().default(false),
});

export const updateBody = z.object({
  reason: z.string().trim().nullable().optional(),
});

export function toDate(s: string) {
  // 'YYYY-MM-DD' diparse sebagai UTC oleh JS, cocok dengan @db.Date
  return new Date(s);
}
