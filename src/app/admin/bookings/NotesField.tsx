// src/app/admin/booking/NotesField.tsx
import type { BookingDetail } from '@/types/api';

export default function NotesField({
  booking,
  onChangeNote,
}: {
  booking: BookingDetail;
  onChangeNote: (note: string | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm mb-1">Catatan</label>
      <textarea
        className="border rounded w-full min-h-24 p-3"
        defaultValue={booking.note ?? ''}
        onBlur={(e) => onChangeNote(e.currentTarget.value || null)}
        placeholder="Catatan admin…"
      />
    </div>
  );
}
