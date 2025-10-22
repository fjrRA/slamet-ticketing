// src/server/routes/admin/bookings/helpers.ts
import { z } from 'zod';
import { AppError } from '../../../utils/app-error';
import { Prisma, BookingStatus } from '@prisma/client'; // ⬅️ pakai Prisma & enum dari client

export const Status = z.nativeEnum(BookingStatus); // ⬅️ enum Prisma, bukan string literal

export const patchBody = z.object({
  status: Status.optional(),
  note: z.string().trim().nullable().optional(),
  partySize: z.number().int().positive().max(500).optional(),
});

export const memberCreate = z.object({
  fullName: z.string().min(1),
  idNumber: z.string().min(1),
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Format tanggal harus YYYY-MM-DD')
    .optional().nullable(), // 'YYYY-MM-DD'
  gender: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

export const memberPatch = memberCreate.partial();

export function transitionDelta(oldS: BookingStatus, newS: BookingStatus) { // ⬅️ pakai BookingStatus
  if (oldS === newS) return { reserved: 0, paid: 0 };
  const allowed: Record<string, boolean> = {
    'PENDING->PAID': true,
    'PENDING->EXPIRED': true,
    'PENDING->CANCELLED': true,
    'PAID->REFUNDED': true,
  };
  if (!allowed[`${oldS}->${newS}`]) {
    throw new AppError(`Transisi status ${oldS} -> ${newS} tidak diizinkan`, 400);
  }
  switch (`${oldS}->${newS}`) {
    case 'PENDING->PAID':      return { reserved: -1, paid: +1 };
    case 'PENDING->EXPIRED':   return { reserved: -1, paid: 0  };
    case 'PENDING->CANCELLED': return { reserved: -1, paid: 0  };
    case 'PAID->REFUNDED':     return { reserved: 0,  paid: -1 };
    default: return { reserved: 0, paid: 0 };
  }
}

/** Validasi & apply delta kuota pada slot dalam satu transaksi. */
export async function applySlotDelta(
  tx: Prisma.TransactionClient, // ⬅️ ini kuncinya: TransactionClient, bukan typeof prisma
  slotId: string,
  deltaReserved: number,
  deltaPaid: number
) {
  if (!deltaReserved && !deltaPaid) return;

  const before = await tx.timeSlot.findUnique({ where: { id: slotId }});
  if (!before) throw new AppError('Slot tidak ditemukan', 500);

  const nextReserved = before.quotaReserved + deltaReserved;
  const nextPaid     = before.quotaPaid     + deltaPaid;

  if (nextReserved < 0 || nextPaid < 0) throw new AppError('Kuota menjadi negatif', 400);
  if (nextReserved + nextPaid > before.quotaTotal) throw new AppError('Kuota melebihi kapasitas total', 400);

  await tx.timeSlot.update({
    where: { id: slotId },
    data: { quotaReserved: nextReserved, quotaPaid: nextPaid },
  });
}
