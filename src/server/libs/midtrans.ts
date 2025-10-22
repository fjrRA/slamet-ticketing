// src/server/libs/midtrans.ts
import midtransClient from 'midtrans-client';
import { createHash } from 'node:crypto';

export const midtransEnabled =
  Boolean(process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY);

export const snap = midtransEnabled
  ? new midtransClient.Snap({
      isProduction: (process.env.MIDTRANS_IS_PROD ?? '0') === '1',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    })
  : null;

export function verifySignature(
  order_id: string,
  status_code: string,
  gross_amount: string,
  signature_key: string
) {
  const raw = `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY!}`;
  const expected = createHash('sha512').update(raw).digest('hex');
  return expected === signature_key;
}

export function generateOrderId(bookingId: string) {
  const d = new Date();
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SLM-${ymd}-${bookingId.slice(0, 6).toUpperCase()}-${rnd}`;
}
