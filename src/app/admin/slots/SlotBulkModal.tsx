// src/app/admin/slots/SlotBulkModal.tsx
import { useMemo, useState } from 'react';
import type { AdminTrail } from '@/types/admin';

type SubmitPayload = { trailId: string; quotaTotal: number; dates: string[] };

export default function SlotBulkModal({
  open,
  trails,
  submitting,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  trails: AdminTrail[];
  submitting?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (p: SubmitPayload) => void;
}) {
  const [trailId, setTrailId] = useState<string>('');
  const [quota, setQuota] = useState<number | ''>('');
  const [mode, setMode] = useState<'paste' | 'range'>('paste');

  // paste mode
  const [paste, setPaste] = useState<string>('');

  // range mode
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [dow, setDow] = useState<boolean[]>([false, true, true, true, true, true, false]); // default weekdays (Mon-Fri)

  const parsedDates = useMemo(() => {
    const set = new Set<string>();
    const re = /^\d{4}-\d{2}-\d{2}$/;

    if (mode === 'paste') {
      paste.split(/\r?\n/).map(s => s.trim()).filter(Boolean).forEach(d => {
        if (re.test(d)) set.add(d);
      });
    } else if (mode === 'range' && start && end) {
      const d1 = new Date(start + 'T00:00:00');
      const d2 = new Date(end + 'T00:00:00');
      if (!Number.isNaN(d1.getTime()) && !Number.isNaN(d2.getTime()) && d1 <= d2) {
        for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
          const day = d.getDay(); // 0..6 (Sun..Sat)
          const idx = day; // map langsung Sun..Sat
          if (dow[idx]) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            set.add(`${yyyy}-${mm}-${dd}`);
          }
        }
      }
    }
    return Array.from(set).sort();
  }, [mode, paste, start, end, dow]);

  if (!open) return null;

  const valid = trailId && typeof quota === 'number' && quota > 0 && parsedDates.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Bulk Create TimeSlots</h3>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Trail *</label>
              <select className="w-full rounded border px-3 py-2"
                value={trailId}
                onChange={e => setTrailId(e.target.value)}>
                <option value="">Pilih trail…</option>
                {trails.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">quotaTotal *</label>
              <input type="number" min={1} className="w-full rounded border px-3 py-2"
                value={quota}
                onChange={e => setQuota(e.target.value ? Number(e.target.value) : '')} />
            </div>
            <div>
              <label className="block text-sm mb-1">Mode</label>
              <select className="w-full rounded border px-3 py-2"
                value={mode}
                onChange={e => setMode(e.target.value as 'paste' | 'range')}>
                <option value="paste">Paste daftar tanggal (YYYY-MM-DD)</option>
                <option value="range">Range + Hari</option>
              </select>
            </div>
          </div>

          {mode === 'paste' ? (
            <div>
              <label className="block text-sm mb-1">Daftar tanggal (satu per baris)</label>
              <textarea className="w-full min-h-32 rounded border p-3"
                placeholder={`2025-07-01\n2025-07-02\n...`}
                value={paste}
                onChange={e => setPaste(e.target.value)} />
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm mb-1">Mulai *</label>
                  <input type="date" className="w-full rounded border px-3 py-2" value={start} onChange={e => setStart(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Selesai *</label>
                  <input type="date" className="w-full rounded border px-3 py-2" value={end} onChange={e => setEnd(e.target.value)} />
                </div>
                <div className="grid grid-cols-7 gap-1 items-end">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((label, i) => (
                    <label key={label} className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={dow[i]} onChange={() => {
                        const c = dow.slice(); c[i] = !c[i]; setDow(c);
                      }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-700">
            Preview: <b>{parsedDates.length}</b> tanggal
            {parsedDates.length > 0 && (
              <div className="mt-1 max-h-28 overflow-auto border rounded p-2 text-xs">
                {parsedDates.slice(0, 100).map(d => <div key={d}>{d}</div>)}
                {parsedDates.length > 100 && <div className="text-gray-500">…dan {parsedDates.length - 100} lagi</div>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            disabled={!valid || submitting}
            onClick={() => onSubmit({ trailId, quotaTotal: typeof quota === 'number' ? quota : 0, dates: parsedDates })}>
            {submitting ? 'Processing…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
