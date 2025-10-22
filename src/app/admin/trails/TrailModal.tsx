import { useState } from 'react';

export default function TrailModal({
  open,
  onClose,
  onSubmit,
  submitting,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    mountainName: string;
    basecamp?: string | null;
    basecampCode?: string | null;
    maxGroupSize?: number;
    isActive: boolean;
  }) => void;
  submitting?: boolean;
  error?: string | null;
}) {
  const [name, setName] = useState('');
  const [mountainName, setMountainName] = useState('Gunung Slamet');
  const [basecamp, setBasecamp] = useState('');
  const [basecampCode, setBasecampCode] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);

  if (!open) return null;

  const onSave = () => {
    onSubmit({
      name: name.trim(),
      mountainName: mountainName.trim(),
      basecamp: basecamp.trim() || undefined,
      basecampCode: basecampCode.trim() || undefined,
      maxGroupSize: typeof maxGroupSize === 'number' ? maxGroupSize : undefined,
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">New Trail</h3>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm mb-1">Nama *</label>
            <input className="w-full rounded border px-3 py-2"
              value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Jalur Bambangan" />
          </div>
          <div>
            <label className="block text-sm mb-1">Gunung *</label>
            <input className="w-full rounded border px-3 py-2"
              value={mountainName} onChange={e => setMountainName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Basecamp</label>
              <input className="w-full rounded border px-3 py-2"
                value={basecamp} onChange={e => setBasecamp(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Kode Basecamp</label>
              <input className="w-full rounded border px-3 py-2"
                value={basecampCode} onChange={e => setBasecampCode(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Max Group Size</label>
              <input type="number" min={1} className="w-full rounded border px-3 py-2"
                value={maxGroupSize}
                onChange={e => setMaxGroupSize(e.target.value ? Number(e.target.value) : '')} />
            </div>
            <div className="flex items-end gap-2">
              <input id="isActive" type="checkbox" className="h-4 w-4"
                checked={isActive} onChange={e => setIsActive(e.target.checked)} />
              <label htmlFor="isActive" className="text-sm select-none">Active</label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            onClick={onSave} disabled={submitting || name.trim().length < 2 || mountainName.trim().length < 2}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>

  );
}
