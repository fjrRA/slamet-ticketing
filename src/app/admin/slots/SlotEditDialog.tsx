// src/app/admin/slots/SlotEditDialog.tsx
import { useEffect, useState } from 'react';
import type { AdminSlot } from '@/types/admin';

export default function SlotEditDialog({
  open,
  slot,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  slot: AdminSlot | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (quotaTotal: number) => void;
}) {
  const [quota, setQuota] = useState<number | ''>('');

  useEffect(() => {
    if (slot) setQuota(slot.quotaTotal);
  }, [slot]);

  if (!open || !slot) return null;

  const reservedPaid = slot.quotaReserved + slot.quotaPaid;
  const invalid = typeof quota !== 'number' || quota < reservedPaid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-3">
          <div className="text-lg font-semibold">Edit Kuota Total</div>
          <div className="text-sm text-gray-600">
            {new Date(slot.date).toLocaleDateString('id-ID')} • {slot.trail?.name}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="text-sm text-gray-700">
            Reserved: <b>{slot.quotaReserved}</b> • Paid: <b>{slot.quotaPaid}</b>
          </div>
          <div>
            <label className="block text-sm mb-1">quotaTotal</label>
            <input
              type="number" min={reservedPaid} className="w-full rounded border px-3 py-2"
              value={quota}
              onChange={e => setQuota(e.target.value ? Number(e.target.value) : '')}
            />
            <div className="mt-1 text-xs text-gray-500">
              Minimal: {reservedPaid} (reserved + paid)
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            disabled={invalid || submitting}
            onClick={() => typeof quota === 'number' && onSubmit(quota)}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
