// src/app/admin/booking/StatusPartyActions.tsx
import type { BookingDetail, BookingStatus } from '@/types/api';
import type { PatchBookingPayload } from '@/app/api/admin';

export default function StatusPartyActions({
  booking,
  onPatch,
  onCheckAll,
  isCheckingAll,
}: {
  booking: BookingDetail;
  onPatch: (p: PatchBookingPayload) => void;
  onCheckAll: () => void;
  isCheckingAll: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          className="border rounded px-3 py-2"
          defaultValue={booking.status}
          onChange={(e) => onPatch({ status: e.target.value as BookingStatus })}
        >
          {['PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED'].map(s =>
            <option key={s} value={s}>{s}</option>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Party Size</label>
        <input
          type="number" min={1} defaultValue={booking.partySize}
          className="border rounded px-3 py-2 w-28"
          onBlur={(e) => {
            const v = Number(e.currentTarget.value || booking.partySize);
            if (v !== booking.partySize) onPatch({ partySize: v });
          }}
        />
      </div>

      <button
        className="border rounded px-3 py-2 ml-auto disabled:opacity-50"
        disabled={booking.status !== 'PAID' || isCheckingAll}
        onClick={onCheckAll}
      >
        Check-in semua
      </button>
    </div>
  );
}
