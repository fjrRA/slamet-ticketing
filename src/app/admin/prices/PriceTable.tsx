// src/app/admin/prices/PriceTable.tsx
import type { AdminPrice } from '@/types/admin';

export default function PriceTable({
  items,
  onEdit,
  onRequestDelete,
}: {
  items: AdminPrice[];
  onEdit: (p: AdminPrice) => void;
  onRequestDelete: (p: AdminPrice) => void;
}) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Trail</th>
            <th className="p-2 text-left">Start</th>
            <th className="p-2 text-left">End</th>
            <th className="p-2 text-right">Local</th>
            <th className="p-2 text-right">Non-Local</th>
            <th className="p-2 text-right">Weekend x</th>
            <th className="p-2 text-left">Label</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.trail?.name ?? '-'}</td>
              <td className="p-2">{new Date(p.startDate).toLocaleDateString('id-ID')}</td>
              <td className="p-2">{new Date(p.endDate).toLocaleDateString('id-ID')}</td>
              <td className="p-2 text-right">Rp {p.priceLocal.toLocaleString('id-ID')}</td>
              <td className="p-2 text-right">Rp {p.priceNonLocal.toLocaleString('id-ID')}</td>
              <td className="p-2 text-right">{p.weekendMultiplier}</td>
              <td className="p-2">{p.seasonLabel ?? '-'}</td>
              <td className="p-2">
                <div className="flex justify-end gap-2">
                  <button className="border rounded px-2 py-1" onClick={() => onEdit(p)}>Edit</button>
                  <button className="border rounded px-2 py-1" onClick={() => onRequestDelete(p)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={8} className="p-6 text-center text-gray-500">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
