// src/components/admin/BookingTable.tsx
import type { Booking, BookingStatus } from "../../types/api";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";

type Props = {
  items: Booking[];
  onAction: (orderId: string, target: BookingStatus) => void;
  isMutating?: boolean;
  mutatingOrderId?: string | null; // 👈 NEW
};

export default function BookingTable({ items, onAction, isMutating, mutatingOrderId }: Props) {
  const fmt = new Intl.NumberFormat("id-ID"); // kecilkan biaya format

  function confirmAndAct(orderId: string, target: BookingStatus) {
    const label = target === "PAID" ? "Tandai sebagai PAID?" :
      target === "EXPIRED" ? "Set ke EXPIRED?" :
        `Ubah status ke ${target}?`;
    if (confirm(label)) onAction(orderId, target);
  }

  return (
    <div className="overflow-auto border rounded-xl bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gray-50 text-left text-sm">
          <tr>
            <th className="p-3">Tanggal</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Trail</th>
            <th className="p-3">Slot</th>
            <th className="p-3">Party</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {items.map((b) => {
            const slotDate = b.slot ? new Date(b.slot.date).toLocaleDateString("id-ID") : "-";
            const rowIsMutating = isMutating && mutatingOrderId === b.orderId; // 👈 hanya baris ini

            return (
              <tr key={b.id} className="border-t">
                <td className="p-3">{new Date(b.createdAt).toLocaleString("id-ID")}</td>

                <td className="p-3 font-mono">
                  <Link to={`/admin/bookings/${b.id}`} className="text-blue-600 hover:underline">
                    {b.orderId}
                  </Link>
                </td>

                <td className="p-3">{b.user?.name ?? "-"}</td>
                <td className="p-3">{b.trail?.name ?? "-"}</td>
                <td className="p-3">{slotDate}</td>
                <td className="p-3">{b.partySize}</td>
                <td className="p-3">Rp {fmt.format(b.total)}</td>
                <td className="p-3"><StatusBadge status={b.status} /></td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/bookings/${b.id}`}
                      className="px-2 py-1 rounded-lg border hover:bg-blue-50"
                      title="Lihat detail"
                    >
                      Detail
                    </Link>

                    {b.status !== "PAID" && (
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg border hover:bg-green-50 disabled:opacity-50"
                        onClick={() => confirmAndAct(b.orderId, "PAID")}
                        disabled={rowIsMutating}
                        title="Tandai sebagai PAID"
                      >
                        {rowIsMutating ? "..." : "Mark as Paid"}
                      </button>
                    )}

                    {b.status === "PENDING" && (
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => confirmAndAct(b.orderId, "EXPIRED")}
                        disabled={rowIsMutating}
                        title="Set EXPIRED"
                      >
                        {rowIsMutating ? "..." : "Set Expired"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={9} className="p-6 text-center text-gray-500">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
