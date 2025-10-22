// src/app/admin/PricesPage.tsx
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pricesApi, trailsApi } from '@/app/api/admin';
import type { Page } from '@/types/api';
import type { AdminPrice, AdminTrail } from '@/types/admin';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import PriceTable from './prices/PriceTable';
import PriceModal from './prices/PriceModal';

function getErr(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e && 'message' in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return 'Terjadi kesalahan';
}

export default function PricesPage() {
  const qc = useQueryClient();

  const [trailId, setTrailId] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminPrice | null>(null);
  const [toDelete, setToDelete] = useState<AdminPrice | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const qTrails = useQuery({
    queryKey: ['admin.trails', 'select'],
    queryFn: () => trailsApi.list({ active: 'true', pageSize: 100 }),
  });

  const qPrices = useQuery<Page<AdminPrice>>({
    queryKey: ['admin.prices', { trailId, from, to, page }],
    queryFn: () => pricesApi.list({ trailId: trailId || undefined, from: from || undefined, to: to || undefined, page }),
  });

  useEffect(() => { setPage(1); }, [trailId, from, to]);

  const mCreate = useMutation({
    mutationFn: pricesApi.create,
    onSuccess: () => { setShowModal(false); setErrMsg(null); qc.invalidateQueries({ queryKey: ['admin.prices'] }); },
    onError: (e: unknown) => setErrMsg(getErr(e)),
  });

  const mUpdate = useMutation({
    mutationFn: (p: { id: string; payload: Partial<AdminPrice> }) => pricesApi.update(p.id, p.payload),
    onSuccess: () => { setEditing(null); setErrMsg(null); qc.invalidateQueries({ queryKey: ['admin.prices'] }); },
    onError: (e: unknown) => setErrMsg(getErr(e)),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => pricesApi.remove(id),
    onSuccess: () => { setToDelete(null); qc.invalidateQueries({ queryKey: ['admin.prices'] }); },
  });

  if (qTrails.isPending || qPrices.isPending) return <div className="p-6">Loading…</div>;
  if (qTrails.error) return <div className="p-6 text-red-600">Error: {(qTrails.error as Error).message}</div>;
  if (qPrices.error) return <div className="p-6 text-red-600">Error: {(qPrices.error as Error).message}</div>;

  const trails = qTrails.data.items as AdminTrail[];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-sm mb-1">Trail</label>
          <select className="border rounded px-3 py-2 min-w-[220px]" value={trailId} onChange={e => setTrailId(e.target.value)}>
            <option value="">(Semua Trail)</option>
            {trails.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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
        <button className="ml-auto border rounded px-3 py-2" onClick={() => { setErrMsg(null); setShowModal(true); }}>
          + New Price
        </button>
      </div>

      <PriceTable
        items={qPrices.data.items}
        onEdit={(p) => setEditing(p)}
        onRequestDelete={(p) => setToDelete(p)}
      />

      {/* pagination */}
      <div className="flex items-center justify-end gap-2">
        <button className="border rounded px-3 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span className="text-sm">Page {page}</span>
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={(qPrices.data.page * qPrices.data.pageSize) >= qPrices.data.total}
          onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      <PriceModal
        open={showModal || !!editing}
        trails={trails}
        error={errMsg ?? undefined}
        submitting={mCreate.isPending || mUpdate.isPending}
        initial={editing ?? undefined}
        onClose={() => { setShowModal(false); setEditing(null); }}
        onSubmit={(payload) => {
          if (editing) mUpdate.mutate({ id: editing.id, payload });
          else mCreate.mutate(payload as Parameters<typeof pricesApi.create>[0]);
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Hapus Harga"
        message={
          <>
            Hapus rentang{' '}
            <b>
              {toDelete ? new Date(toDelete.startDate).toLocaleDateString('id-ID') : ''} — {toDelete ? new Date(toDelete.endDate).toLocaleDateString('id-ID') : ''}
            </b>{' '}
            ({toDelete?.trail?.name})?
          </>
        }
        confirmText="Hapus"
        cancelText="Batal"
        loading={mDelete.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => { if (toDelete) mDelete.mutate(toDelete.id); }}
      />
    </div>
  );
}
