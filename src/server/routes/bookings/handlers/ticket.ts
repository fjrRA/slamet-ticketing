// src/server/routes/bookings/handlers/ticket.ts
import type { RequestHandler } from 'express';
import { prisma } from '@server/libs/prisma';
import { buildTicketPdf } from '../pdf';

export const getTicketPdf: RequestHandler = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { orderId },
      include: { user: true, trail: true, slot: true, members: true, payment: true },
    });

    if (!booking) return res.status(404).send('Not found');
    if (booking.status !== 'PAID') return res.status(400).send('Belum dibayar');

    const bytes = await buildTicketPdf(booking);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${orderId}.pdf"`);
    res.send(Buffer.from(bytes));
  } catch (e) { next(e); }
};