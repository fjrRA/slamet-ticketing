// src/components/admin/StatusBadge.tsx
import type { BookingStatus } from "../../types/api";

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const cls =
    status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
      status === "PAID" ? "bg-green-100 text-green-800" :
        status === "EXPIRED" ? "bg-gray-200 text-gray-700" :
          status === "CANCELLED" ? "bg-red-100 text-red-700" :
    /* REFUNDED */           "bg-blue-100 text-blue-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
