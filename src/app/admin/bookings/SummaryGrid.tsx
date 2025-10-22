// src/app/admin/booking/components/SummaryGrid.tsx
import type { BookingDetail } from '@/types/api';

export default function SummaryGrid({ booking }: { booking: BookingDetail }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="border rounded p-3">
        <div className="text-xs text-gray-500">Trail</div>
        <div className="font-medium">{booking.trail?.name}</div>
      </div>
      <div className="border rounded p-3">
        <div className="text-xs text-gray-500">Tanggal Slot</div>
        <div className="font-medium">
          {booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : '-'}
        </div>
      </div>
      <div className="border rounded p-3">
        <div className="text-xs text-gray-500">Total</div>
        <div className="font-medium">Rp {booking.total?.toLocaleString('id-ID')}</div>
      </div>
    </div>
  );
}
