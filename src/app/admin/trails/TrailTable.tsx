// src/app/admin/trails/TrailTable.tsx
import type { AdminTrail } from '@/types/api';

export default function TrailTable({
  items,
  onToggle,
  onRequestDelete,               // ✅ konsisten
}: {
  items: AdminTrail[];
  onToggle: (t: AdminTrail) => void;
  onRequestDelete: (t: AdminTrail) => void;  // ✅ konsisten
}) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-[760px] w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Nama</th>
            <th className="p-2 text-left">Basecamp</th>
            <th className="p-2">Active</th>
            <th className="p-2">Slots</th>
            <th className="p-2">Bookings</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.name}</td>
              <td className="p-2">{t.basecamp ?? '-'}</td>
              <td className="p-2 text-center">{t.isActive ? '✅' : '❌'}</td>
              <td className="p-2 text-center">{t._count.slots}</td>
              <td className="p-2 text-center">{t._count.bookings}</td>
              <td className="p-2 text-center">
                <div className="flex gap-2 justify-center">
                  <button className="border rounded px-2 py-1" onClick={() => onToggle(t)}>
                    {t.isActive ? 'Archive' : 'Activate'}
                  </button>
                  <button className="border rounded px-2 py-1" onClick={() => onRequestDelete(t)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} className="p-6 text-center text-gray-500">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
