// src/server/routes/payments/snap-token.post.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';
import { snap, midtransEnabled } from '@server/libs/midtrans';
import { AppError } from '@server/utils/app-error';
import type { SnapParam } from './types';

function makeAttemptOrderId(base: string) {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${base}-R${rnd}`;
}

// untuk ekstrak pesan error tanpa pakai any
type MidtransApiResponse = { error_messages?: string[] };
type MidtransErrorLike = { ApiResponse?: MidtransApiResponse; message?: string };

export const postSnapToken: RequestHandler = async (req, res) => {
  try {
    if (!midtransEnabled) {
      return res.status(501).json({
        ok: false,
        message:
          'Midtrans belum dikonfigurasi. Isi MIDTRANS_* di .env atau aktifkan PAYMENTS_MOCK=1.',
      });
    }

    const { bookingId, orderId } = (req.body ?? {}) as {
      bookingId?: string;
      orderId?: string;
    };
    if (!bookingId && !orderId) throw new AppError('bookingId atau orderId wajib', 400);

    const booking = bookingId
      ? await prisma.booking.findFirst({
          where: { id: bookingId, userId: req.auth!.uid },
          include: { user: true, slot: true, trail: true, payment: true },
        })
      : await prisma.booking.findFirst({
          where: { orderId: orderId!, userId: req.auth!.uid },
          include: { user: true, slot: true, trail: true, payment: true },
        });

    if (!booking) throw new AppError('Order tidak ditemukan / tidak berhak', 404);
    if (booking.status !== 'PENDING') throw new AppError('Booking tidak dapat dibayar', 400);

    const midtransOrderId = makeAttemptOrderId(booking.orderId);

    const param: SnapParam = {
      transaction_details: { order_id: midtransOrderId, gross_amount: booking.total },
      credit_card: { secure: true },
      item_details: [
        {
          id: booking.trailId,
          name: `Pendakian ${booking.trail.name} (${booking.slot.date.toISOString().slice(0, 10)})`,
          price: Math.round(booking.total / booking.partySize),
          quantity: booking.partySize,
        },
      ],
      customer_details: {
        first_name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone ?? undefined,
      },
      expiry: { unit: 'minutes', duration: 30 },
      callbacks: {
        finish: `${process.env.PUBLIC_BASE_URL}/me/bookings`,
        pending: `${process.env.PUBLIC_BASE_URL}/me/bookings`,
        error: `${process.env.PUBLIC_BASE_URL}/me/bookings`,
      },
    };

    const trx = await snap!.createTransaction(param);

    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: { grossAmount: booking.total, transactionStatus: 'pending' },
      create: { bookingId: booking.id, grossAmount: booking.total, transactionStatus: 'pending' },
    });

    res.json({ ok: true, token: trx.token, redirect_url: trx.redirect_url });
  } catch (e: unknown) {
    const err = e as MidtransErrorLike;
    const msg =
      (err.ApiResponse?.error_messages && err.ApiResponse.error_messages.join(', ')) ||
      err?.message ||
      'Gagal membuat transaksi';
    res.status(400).json({ ok: false, message: msg });
  }
};
