// src/components/user/check-quota/QuotaFilterForm.tsx
import type { Trail } from "@/app/user/check-quota/types";

type Props = {
  trails: Trail[];
  trailId: string;
  date: string;
  party: number;
  onTrailChange: (id: string) => void;
  onDateChange: (iso: string) => void;
  onPartyChange: (n: number) => void;
};

export default function QuotaFilterForm({
  trails, trailId, date, party,
  onTrailChange, onDateChange, onPartyChange,
}: Props) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-sm mb-1">Jalur</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={trailId}
          onChange={(e) => onTrailChange(e.target.value)}
        >
          {trails.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Jumlah Orang</label>
          <input
            type="number" min={1} max={20}
            value={party}
            onChange={(e) => onPartyChange(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>
    </div>
  );
}
