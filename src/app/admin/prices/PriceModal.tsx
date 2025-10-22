// src/app/admin/prices/PriceModal.tsx
import { useEffect, useMemo, useState } from 'react';
import type { AdminTrail, AdminPrice } from '@/types/admin';

type Submit = Partial<Pick<AdminPrice,
  'startDate' | 'endDate' | 'priceLocal' | 'priceNonLocal' | 'weekendMultiplier' | 'seasonLabel'
>> & { trailId: string };

export default function PriceModal({
  open,
  trails,
  initial,
  submitting,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  trails: AdminTrail[];
  initial?: AdminPrice;
  submitting?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: Submit) => void;
}) {
  const [trailId, setTrailId] = useState<string>('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [priceLocal, setPriceLocal] = useState<number | ''>('');
  const [priceNonLocal, setPriceNonLocal] = useState<number | ''>('');
  const [weekendMultiplier, setWeekendMultiplier] = useState<number | ''>(1);
  const [seasonLabel, setSeasonLabel] = useState<string>('');

  useEffect(() => {
    if (initial) {
      setTrailId(initial.trailId);
      setStart(initial.startDate.slice(0, 10));
      setEnd(initial.endDate.slice(0, 10));
      setPriceLocal(initial.priceLocal);
      setPriceNonLocal(initial.priceNonLocal);
      setWeekendMultiplier(initial.weekendMultiplier);
      setSeasonLabel(initial.seasonLabel ?? '');
    } else {
      setTrailId('');
      setStart('');
      setEnd('');
      setPriceLocal('');
      setPriceNonLocal('');
      setWeekendMultiplier(1);
      setSeasonLabel('');
    }
  }, [initial, open]);

  const valid = useMemo(() => {
    const okTrail = !!trailId;
    const okDates = !!start && !!end && start <= end;
    const okLocal = typeof priceLocal === 'number' && priceLocal >= 0;
    const okNon = typeof priceNonLocal === 'number' && priceNonLocal >= 0;
    const okWm = typeof weekendMultiplier === 'number' && weekendMultiplier >= 1;
    return okTrail && okDates && okLocal && okNon && okWm;
  }, [trailId, start, end, priceLocal, priceNonLocal, weekendMultiplier]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Price' : 'New Price'}</h3>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Trail *</label>
            <select className="w-full rounded border px-3 py-2"
              value={trailId} onChange={e => setTrailId(e.target.value)} disabled={!!initial}>
              <option value="">Pilih trail…</option>
              {trails.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Start *</label>
              <input type="date" className="w-full rounded border px-3 py-2" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">End *</label>
              <input type="date" className="w-full rounded border px-3 py-2" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Harga Lokal *</label>
            <input type="number" min={0} className="w-full rounded border px-3 py-2"
              value={priceLocal} onChange={e => setPriceLocal(e.target.value ? Number(e.target.value) : '')} />
          </div>
          <div>
            <label className="block text-sm mb-1">Harga Non-Lokal *</label>
            <input type="number" min={0} className="w-full rounded border px-3 py-2"
              value={priceNonLocal} onChange={e => setPriceNonLocal(e.target.value ? Number(e.target.value) : '')} />
          </div>

          <div>
            <label className="block text-sm mb-1">Weekend Multiplier (≥ 1)</label>
            <input type="number" step="0.1" min={1} className="w-full rounded border px-3 py-2"
              value={weekendMultiplier} onChange={e => setWeekendMultiplier(e.target.value ? Number(e.target.value) : '')} />
          </div>
          <div>
            <label className="block text-sm mb-1">Label Musim</label>
            <input className="w-full rounded border px-3 py-2"
              value={seasonLabel} onChange={e => setSeasonLabel(e.target.value)} placeholder="High season, Lebaran, dll." />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={submitting}>Cancel</button>
          <button
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            disabled={!valid || submitting}
            onClick={() => onSubmit({
              trailId,
              startDate: start,
              endDate: end,
              priceLocal: typeof priceLocal === 'number' ? priceLocal : 0,
              priceNonLocal: typeof priceNonLocal === 'number' ? priceNonLocal : 0,
              weekendMultiplier: typeof weekendMultiplier === 'number' ? weekendMultiplier : 1,
              seasonLabel: seasonLabel.trim() || null,
            })}
          >
            {submitting ? 'Saving…' : (initial ? 'Save Changes' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
