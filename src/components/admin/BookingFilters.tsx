// src/components/admin/BookingFilters.tsx
import { useId } from "react";
import type { BookingStatus } from "../../types/api";

const STATUS_LIST = ["PENDING", "PAID", "EXPIRED", "CANCELLED", "REFUNDED"] as const;

type Props = {
  q: string;
  status: BookingStatus | "";
  onChange: (next: { q?: string; status?: BookingStatus | ""; resetPage?: boolean }) => void;
};

function parseStatus(v: string): BookingStatus | "" {
  return (STATUS_LIST as readonly string[]).includes(v) ? (v as BookingStatus) : "";
}

export default function BookingFilters({ q, status, onChange }: Props) {
  const searchId = useId();
  const statusId = useId();

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search */}
      <div className="flex items-center gap-2">
        <label htmlFor={searchId} className="text-sm text-gray-600">Cari</label>
        <input
          id={searchId}
          className="border rounded-lg px-3 py-2"
          placeholder="orderId / user / trail"
          value={q}
          onChange={(e) => onChange({ q: e.target.value, resetPage: true })}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <label htmlFor={statusId} className="text-sm text-gray-600">Status</label>
        <select
          id={statusId}
          className="border rounded-lg px-3 py-2"
          value={status}
          onChange={(e) => onChange({ status: parseStatus(e.target.value), resetPage: true })}
        >
          <option value="">Semua</option>
          {STATUS_LIST.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
