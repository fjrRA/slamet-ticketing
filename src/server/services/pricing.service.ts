// src/server/services/pricing.service.ts
import { prisma } from '@server/libs/prisma';

export async function calcTotal(
  trailId: string,
  date: Date,
  partySize: number,
  isNonLocal = false
) {
  const price = await prisma.price.findFirst({
    where: { trailId, startDate: { lte: date }, endDate: { gte: date } }
  });
  if (!price) throw new Error('Harga belum diatur untuk tanggal ini');

  const day = date.getUTCDay(); // 0=Min, 6=Sab
  const weekendMultiplier = (day === 0 || day === 6) ? (price.weekendMultiplier ?? 1) : 1;
  const base = isNonLocal ? price.priceNonLocal : price.priceLocal;
  const perHead = Math.round(base * weekendMultiplier);

  return { perHead, total: perHead * partySize, priceId: price.id };
}
