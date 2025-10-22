// src/server/routes/payments/notify.post.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';
import type { MidtransNotification } from './types';
import { verifySignature } from '@server/libs/midtrans';

export const postNotify: RequestHandler = async (req, res) => {
  const body = (req.body ?? {}) as MidtransNotification;

  const okSig =
    body.signature_key &&
    verifySignature(body.order_id, body.status_code, body.gross_amount, body.signature_key);

  if (!okSig) return res.status(401).json({ ok: false, message: 'invalid signature' });

  // ← normalize: buang suffix -Rxxxxx supaya match ke booking.orderId asli
  const baseOrderId = (body.order_id || '').replace(/-R[A-Z0-9]+$/i, '');

  const booking = await prisma.booking.findUnique({
    where: { orderId: baseOrderId },
    select: { id: true, slotId: true, partySize: true, status: true },
  });
  if (!booking) return res.json({ ok: true }); // idempotent

  const ts = body.transaction_status;
  const isPaid = ts === 'settlement' || ts === 'capture' || ts === 'success';
  const isExpired = ts === 'expire';
  const isCancelled = ts === 'cancel' || ts === 'deny';

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        transactionId: body.transaction_id ?? null,
        paymentType: body.payment_type ?? null,
        transactionStatus: ts ?? 'pending',
        fraudStatus: body.fraud_status ?? null,
        signatureKey: body.signature_key ?? null,
        rawNotif: body,
        settledAt: isPaid ? new Date() : null,
        grossAmount: Number(body.gross_amount || 0),
      },
      create: {
        bookingId: booking.id,
        transactionId: body.transaction_id ?? null,
        paymentType: body.payment_type ?? null,
        transactionStatus: ts ?? 'pending',
        fraudStatus: body.fraud_status ?? null,
        signatureKey: body.signature_key ?? null,
        rawNotif: body,
        settledAt: isPaid ? new Date() : null,
        grossAmount: Number(body.gross_amount || 0),
      },
    });

    if (booking.status === 'PENDING' && isPaid) {
      await tx.timeSlot.update({
        where: { id: booking.slotId },
        data: { quotaPaid: { increment: booking.partySize }, quotaReserved: { decrement: booking.partySize } },
      });
      await tx.booking.update({ where: { id: booking.id }, data: { status: 'PAID' } });
    } else if (booking.status === 'PENDING' && (isExpired || isCancelled)) {
      await tx.timeSlot.update({
        where: { id: booking.slotId },
        data: { quotaReserved: { decrement: booking.partySize } },
      });
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: isExpired ? 'EXPIRED' : 'CANCELLED' },
      });
    }
  });

  res.json({ ok: true });
};
