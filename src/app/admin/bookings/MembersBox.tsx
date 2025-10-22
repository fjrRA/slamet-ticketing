// src/app/admin/booking/MembersBox.tsx
import { useState } from 'react';
import type { BookingDetail, BookingMember } from '@/types/api';
import type { MemberPayload } from '@/app/api/admin';

export default function MembersBox({
  booking,
  onAdd,
  onUpdate,
  onDelete,
  onCheckIn,
}: {
  booking: BookingDetail;
  onAdd: (payload: MemberPayload) => void;
  onUpdate: (memberId: string, payload: Partial<MemberPayload>) => void;
  onDelete: (memberId: string) => void;
  onCheckIn: (memberId: string) => void;
}) {
  const [form, setForm] = useState<MemberPayload>({
    fullName: '',
    idNumber: '',
    birthdate: '',
    gender: '',
    city: '',
  });

  const locked = booking.status === 'CANCELLED';

  return (
    <div className="space-y-3">
      {locked && (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Booking berstatus CANCELLED — anggota tidak bisa diubah.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Anggota ({booking.members?.length ?? 0}/{booking.partySize})</h3>
        <div className="flex gap-2">
          <input className="border rounded px-2 py-1" placeholder="Nama"
            value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
          <input className="border rounded px-2 py-1" placeholder="No. Identitas"
            value={form.idNumber} onChange={e => setForm(f => ({ ...f, idNumber: e.target.value }))} />
          <input className="border rounded px-2 py-1" placeholder="YYYY-MM-DD"
            value={form.birthdate ?? ''} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} />
          <button className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={locked}
            onClick={() => onAdd(form)}>+ Tambah</button>
        </div>
      </div>

      <div className="border rounded divide-y">
        {(booking.members ?? []).map((m: BookingMember) => (
          <div key={m.id} className="p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{m.fullName}</div>
              <div className="text-xs text-gray-500">
                ID: {m.idNumber} • {m.birthdate ? new Date(m.birthdate).toLocaleDateString() : '-'}
              </div>
            </div>
            <div className="text-xs">
              {m.checkedIn ? (
                <span className="px-2 py-1 rounded bg-green-100 text-green-700">Checked-in</span>
              ) : (
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Belum</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="border rounded px-2 py-1 disabled:opacity-50"
                disabled={locked}
                onClick={() => onUpdate(m.id, { fullName: prompt('Nama?', m.fullName) ?? m.fullName })}
              >
                Edit
              </button>
              <button
                className="border rounded px-2 py-1 disabled:opacity-50"
                disabled={locked || m.checkedIn}
                onClick={() => { if (confirm('Hapus anggota ini?')) onDelete(m.id); }}
              >
                Hapus
              </button>
              <button
                className="border rounded px-2 py-1 disabled:opacity-50"
                disabled={locked || m.checkedIn || booking.status !== 'PAID'}
                onClick={() => onCheckIn(m.id)}
              >
                Check-in
              </button>
            </div>
          </div>
        ))}
        {(booking.members ?? []).length === 0 && (
          <div className="p-3 text-sm text-gray-500">Belum ada anggota.</div>
        )}
      </div>
    </div>
  );
}
