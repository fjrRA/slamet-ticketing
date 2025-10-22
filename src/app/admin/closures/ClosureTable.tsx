// src/app/admin/closures/ClosureTable.tsx
import type { AdminClosure } from '@/types/admin';

export default function ClosureTable({
  items,
  onEdit,
  onRequestDelete,
}: {
  items: AdminClosure[];
  onEdit: (c: AdminClosure) => void;
  onRequestDelete: (c: AdminClosure) => void;
}) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-[760px] w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Trail</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2">Bookings</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.trail?.name ?? '-'}</td>
              <td className="p-2 text-center">{new Date(c.date).toLocaleDateString('id-ID')}</td>
              <td className="p-2">{c.reason ?? '-'}</td>
              <td className="p-2 text-center">{c.bookingCount ?? 0}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button className="border rounded px-2 py-1" onClick={() => onEdit(c)}>Edit</button>
                  <button className="border rounded px-2 py-1" onClick={() => onRequestDelete(c)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={5} className="p-6 text-center text-gray-500">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
