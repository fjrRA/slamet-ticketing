// src/app/admin/closures/ClosuresFormDialog.tsx
import { useState } from 'react';
import type { AdminTrail } from '@/types/admin';

export default function ClosureFormDialog({
  open,
  trails,
  submitting,
  error,
  initial,      // untuk edit; untuk create boleh undefined
  onClose,
  onSubmit,
}: {
  open: boolean;
  trails: AdminTrail[];
  submitting?: boolean;
  error?: string | null;
  initial?: { trailId?: string; date?: string; reason?: string | null };
  onClose: () => void;
  onSubmit: (p: { trailId: string; date: string; reason?: string | null; force?: boolean }) => void;
}) {
  const [trailId, setTrailId] = useState(initial?.trailId ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [reason, setReason] = useState(initial?.reason ?? '');
  const [force, setForce] = useState(false);

  if (!open) return null;

  const canSave = !!trailId && !!date;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Closure' : 'New Closure'}</h3>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm mb-1">Trail *</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={trailId}
              onChange={(e) => setTrailId(e.target.value)}
            >
              <option value="">Pilih trail…</option>
              {trails.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Tanggal *</label>
            <input
              type="date"
              className="w-full rounded border px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Alasan (opsional)</label>
            <input
              className="w-full rounded border px-3 py-2"
              placeholder="Mis. penutupan jalur, cuaca buruk"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
            />
            Izinkan jika sudah ada booking (force)
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            disabled={!canSave || submitting}
            onClick={() => onSubmit({ trailId, date, reason: reason.trim() || undefined, force })}
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
