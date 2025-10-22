// src/app/admin/closures/ClosuresFilters.tsx
import type { AdminTrail } from '@/types/admin';

export default function ClosureFilters({
  trails,
  trailId,
  from,
  to,
  onChange,
  onNew,
}: {
  trails: AdminTrail[];
  trailId: string;
  from: string;
  to: string;
  onChange: (p: Partial<{ trailId: string; from: string; to: string }>) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div>
        <label className="block text-sm mb-1">Trail</label>
        <select
          className="border rounded px-3 py-2 min-w-[220px]"
          value={trailId}
          onChange={(e) => onChange({ trailId: e.target.value })}
        >
          <option value="">(Semua Trail)</option>
          {trails.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">From</label>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={from}
          onChange={(e) => onChange({ from: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">To</label>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={to}
          onChange={(e) => onChange({ to: e.target.value })}
        />
      </div>

      <button className="ml-auto border rounded px-3 py-2" onClick={onNew}>
        + New Closure
      </button>
    </div>
  );
}
