// src/app/admin/slots/SlotTable.tsx
import type { AdminSlot } from '@/types/admin';

export default function SlotTable({
  items,
  onEdit,
  onRequestDelete,
}: {
  items: AdminSlot[];
  onEdit: (s: AdminSlot) => void;
  onRequestDelete: (s: AdminSlot) => void;
}) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-[820px] w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Tanggal</th>
            <th className="p-2 text-left">Trail</th>
            <th className="p-2 text-right">Reserved</th>
            <th className="p-2 text-right">Paid</th>
            <th className="p-2 text-right">Total</th>
            <th className="p-2 text-right">Bookings</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s => {
            const d = new Date(s.date);
            return (
              <tr key={s.id} className="border-t">
                <td className="p-2">{d.toLocaleDateString('id-ID')}</td>
                <td className="p-2">{s.trail?.name ?? '-'}</td>
                <td className="p-2 text-right">{s.quotaReserved}</td>
                <td className="p-2 text-right">{s.quotaPaid}</td>
                <td className="p-2 text-right">{s.quotaTotal}</td>
                <td className="p-2 text-right">{s._count.bookings}</td>
                <td className="p-2">
                  <div className="flex gap-2 justify-end">
                    <button className="border rounded px-2 py-1" onClick={() => onEdit(s)}>
                      Edit
                    </button>
                    <button className="border rounded px-2 py-1" onClick={() => onRequestDelete(s)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr><td colSpan={7} className="p-6 text-center text-gray-500">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
