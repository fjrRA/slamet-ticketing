// src/server/routes/admin/trails/helpers.ts
import { z } from 'zod';

export const trailCreateBody = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter'),       // ⬅ trim
  mountainName: z.string().trim().min(2).default('Gunung Slamet'), // ⬅ trim
  basecamp: z.string().trim().optional().nullable(),
  basecampCode: z.string().trim().optional().nullable(),
  maxGroupSize: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const trailUpdateBody = trailCreateBody.partial();
