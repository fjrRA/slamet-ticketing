// src/server/routes/bookings/pdf.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Booking, BookingMember, TimeSlot, Trail, User, Payment } from '@prisma/client';

type BookingWithRels = Booking & {
  user: User;
  trail: Trail;
  slot: TimeSlot;
  members: BookingMember[];
  payment: Payment | null;
};

export async function buildTicketPdf(booking: BookingWithRels) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = height - 72;
  const title = 'Tiket Pendakian Gunung Slamet';
  const titleSize = 18;
  const titleWidth = bold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, { x: (width - titleWidth) / 2, y, size: titleSize, font: bold, color: rgb(0,0,0) });
  y -= 28;

  const lines = [
    `Order ID           : ${booking.orderId}`,
    `Nama Jalur         : ${booking.trail.name}`,
    `Basecamp           : ${booking.trail.basecamp ?? '-'}`,
    `Tanggal Pendakian  : ${booking.slot.date.toISOString().slice(0,10)}`,
    `Jumlah Pendaki     : ${booking.partySize}`,
    `Total              : Rp${booking.total.toLocaleString('id-ID')}`,
    `Status Pembayaran  : LUNAS`,
    `Pemesan            : ${booking.user.name} (${booking.user.email})`,
    booking.note ? `Catatan            : ${booking.note}` : null,
  ].filter(Boolean) as string[];

  for (const line of lines) {
    page.drawText(line, { x: 72, y, size: 12, font });
    y -= 18;
  }

  if (booking.members.length) {
    y -= 10;
    page.drawText('Daftar Anggota:', { x: 72, y, size: 12, font: bold });
    y -= 16;
    booking.members.slice(0, 28).forEach((m, i) => {
      page.drawText(`${i + 1}. ${m.fullName}${m.idNumber ? ' - ' + m.idNumber : ''}`, { x: 80, y, size: 11, font });
      y -= 14;
    });
  }

  y -= 18;
  page.drawText(
    'Harap tunjukkan tiket ini saat registrasi di basecamp. Simpan dengan baik.',
    { x: 72, y, size: 11, font }
  );

  return pdf.save(); // Uint8Array
}
