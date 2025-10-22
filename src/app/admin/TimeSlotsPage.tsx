// src/app/admin/TimeSlotsPage.tsx
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { slotsApi, trailsApi } from '@/app/api/admin';
import type { Page } from '@/types/api';
import type { AdminSlot, AdminTrail } from '@/types/admin';
import SlotTable from './slots/SlotTable';
import SlotEditDialog from './slots/SlotEditDialog';
import SlotBulkModal from './slots/SlotBulkModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function TimeSlotsPage() {
  const qc = useQueryClient();

  // filters
  const [trailId, setTrailId] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // dialogs state
  const [editSlot, setEditSlot] = useState<AdminSlot | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [toDelete, setToDelete] = useState<AdminSlot | null>(null);

  // data
  const qTrails = useQuery({
    queryKey: ['admin.trails', 'select'],
    queryFn: () => trailsApi.list({ active: 'true', pageSize: 100 }),
  });

  const qSlots = useQuery<Page<AdminSlot>>({
    queryKey: ['admin.slots', { trailId, from, to, page }],
    queryFn: () => slotsApi.list({ trailId: trailId || undefined, from: from || undefined, to: to || undefined, page }),
  });

  useEffect(() => { setPage(1); }, [trailId, from, to]); // reset page on filter change

  // mutations
  const mUpdateQuota = useMutation({
    mutationFn: (p: { id: string; quotaTotal: number }) => slotsApi.updateQuota(p.id, p.quotaTotal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.slots'] }),
  });

  const mBulk = useMutation({
    mutationFn: (p: { trailId: string; quotaTotal: number; dates: string[] }) => slotsApi.bulkCreate(p.trailId, { dates: p.dates, quotaTotal: p.quotaTotal }),
    onSuccess: () => {
      setShowBulk(false);
      qc.invalidateQueries({ queryKey: ['admin.slots'] });
    },
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => slotsApi.remove(id),
    onSuccess: () => {
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ['admin.slots'] });
    },
  });

  // ui states
  const trails = qTrails.data?.items ?? [];
  const disableDelete = toDelete && toDelete._count.bookings > 0;

  if (qSlots.isPending || qTrails.isPending) return <div className="p-6">Loading…</div>;
  if (qSlots.error) return <div className="p-6 text-red-600">Error: {(qSlots.error as Error).message}</div>;
  if (qTrails.error) return <div className="p-6 text-red-600">Error: {(qTrails.error as Error).message}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-sm mb-1">Trail</label>
          <select className="border rounded px-3 py-2 min-w-[220px]"
            value={trailId}
            onChange={e => setTrailId(e.target.value)}>
            <option value="">(Semua Trail)</option>
            {trails.map((t: AdminTrail) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">From</label>
          <input type="date" className="border rounded px-3 py-2" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">To</label>
          <input type="date" className="border rounded px-3 py-2" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button className="ml-auto border rounded px-3 py-2" onClick={() => setShowBulk(true)}>
          + Bulk Create
        </button>
      </div>

      <SlotTable
        items={qSlots.data.items}
        onEdit={(s) => setEditSlot(s)}
        onRequestDelete={(s) => setToDelete(s)}
      />

      {/* pagination sederhana */}
      <div className="flex items-center justify-end gap-2">
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}>
          Prev
        </button>
        <span className="text-sm">Page {page}</span>
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={(qSlots.data.page * qSlots.data.pageSize) >= qSlots.data.total}
          onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>

      {/* edit quota */}
      <SlotEditDialog
        open={!!editSlot}
        slot={editSlot}
        submitting={mUpdateQuota.isPending}
        onClose={() => setEditSlot(null)}
        onSubmit={(quota) => {
          if (!editSlot) return;
          mUpdateQuota.mutate({ id: editSlot.id, quotaTotal: quota });
        }}
      />

      {/* bulk create */}
      <SlotBulkModal
        open={showBulk}
        trails={trails}
        submitting={mBulk.isPending}
        error={undefined}
        onClose={() => setShowBulk(false)}
        onSubmit={(p) => mBulk.mutate(p)}
      />

      {/* delete */}
      <ConfirmDialog
        open={!!toDelete}
        title="Hapus Slot"
        message={
          <>
            Hapus slot tanggal <b>{toDelete ? new Date(toDelete.date).toLocaleDateString('id-ID') : ''}</b>?
            <div className="text-sm text-gray-600">
              {toDelete?._count.bookings ?? 0} booking terkait.
              {disableDelete && ' Tidak bisa dihapus (booking > 0).'}
            </div>
          </>
        }
        confirmText="Hapus"
        cancelText="Batal"
        loading={mDelete.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete || disableDelete) return;
          mDelete.mutate(toDelete.id);
        }}
      />
    </div>
  );
}
