// src/server/routes/bookings/schemas.ts
import { z } from 'zod';

export const createBookingSchema = z.object({
  trailId: z.string().cuid(),
  slotId: z.string().cuid(),
  partySize: z.number().int().positive().max(20),
  isNonLocal: z.boolean().optional(),
  note: z.string().max(500).optional(),
  members: z.array(z.object({
    fullName: z.string().min(2),
    idNumber: z.string().min(1),
    birthdate: z.string().optional(), // "YYYY-MM-DD"
    gender: z.string().optional(),
    city: z.string().optional(),
  })).min(1),
}).refine(v => v.members.length === v.partySize, {
  message: 'Jumlah anggota harus sama dengan partySize',
  path: ['members'],
});