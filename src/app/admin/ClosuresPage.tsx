// src/app/admin/ClosuresPage.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { closuresApi, trailsApi } from '@/app/api/admin';
import type { Page } from '@/types/api';
import type { AdminTrail, AdminClosure } from '@/types/admin';
import ClosureFilters from './closures/ClosuresFilters';
import ClosureFormDialog from './closures/ClosuresFormDialog';
import ClosureTable from './closures/ClosureTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

function getErrMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e && 'message' in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return 'Terjadi kesalahan';
}

export default function ClosuresPage() {
  const qc = useQueryClient();

  // filters
  const [trailId, setTrailId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  // dialogs
  const [showForm, setShowForm] = useState(false);
  const [formInitial, setFormInitial] = useState<{ trailId?: string; date?: string; reason?: string | null }>();
  const [toDelete, setToDelete] = useState<AdminClosure | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // data
  const qTrails = useQuery({
    queryKey: ['admin.trails', 'select'],
    queryFn: () => trailsApi.list({ active: 'true', pageSize: 100 }),
  });

  const qClosures = useQuery<Page<AdminClosure>>({
    queryKey: ['admin.closures', { trailId, from, to, page }],
    queryFn: () => closuresApi.list({
      trailId: trailId || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
    }),
  });

  useEffect(() => { setPage(1); }, [trailId, from, to]); // reset page saat filter berubah

  // mutations
  const mCreate = useMutation({
    mutationFn: closuresApi.create,
    onSuccess: () => { setShowForm(false); qc.invalidateQueries({ queryKey: ['admin.closures'] }); },
    onError: (e: unknown) => setErrMsg(getErrMessage(e)),
  });

  const mUpdate = useMutation({
    mutationFn: (p: { id: string; reason?: string | null }) => closuresApi.update(p.id, { reason: p.reason }),
    onSuccess: () => { setShowForm(false); qc.invalidateQueries({ queryKey: ['admin.closures'] }); },
    onError: (e: unknown) => setErrMsg(getErrMessage(e)),
  });

  const mDelete = useMutation({
    mutationFn: closuresApi.remove,
    onSuccess: () => { setToDelete(null); qc.invalidateQueries({ queryKey: ['admin.closures'] }); },
  });

  if (qTrails.isPending || qClosures.isPending) return <div className="p-6">Loading…</div>;
  if (qTrails.error) return <div className="p-6 text-red-600">Error: {(qTrails.error as Error).message}</div>;
  if (qClosures.error) return <div className="p-6 text-red-600">Error: {(qClosures.error as Error).message}</div>;

  const trails = qTrails.data.items;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Closures</h2>

      <ClosureFilters
        trails={trails as AdminTrail[]}
        trailId={trailId}
        from={from}
        to={to}
        onChange={(p) => {
          if ('trailId' in p) setTrailId(p.trailId ?? '');
          if ('from' in p) setFrom(p.from ?? '');
          if ('to' in p) setTo(p.to ?? '');
        }}
        onNew={() => { setErrMsg(null); setFormInitial(undefined); setShowForm(true); }}
      />

      <ClosureTable
        items={qClosures.data.items}
        onEdit={(c) => { setErrMsg(null); setFormInitial({ trailId: c.trailId, date: c.date.slice(0, 10), reason: c.reason ?? '' }); setShowForm(true); }}
        onRequestDelete={(c) => setToDelete(c)}
      />

      {/* pagination */}
      <div className="flex items-center justify-end gap-2">
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >Prev</button>
        <span className="text-sm">Page {page}</span>
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={(qClosures.data.page * qClosures.data.pageSize) >= qClosures.data.total}
          onClick={() => setPage((p) => p + 1)}
        >Next</button>
      </div>

      <ClosureFormDialog
        open={showForm}
        trails={trails as AdminTrail[]}
        submitting={mCreate.isPending || mUpdate.isPending}
        error={errMsg}
        initial={formInitial}
        onClose={() => setShowForm(false)}
        onSubmit={(p) => {
          // jika initial ada -> kita anggap edit (hanya reason yang diubah),
          // tapi kalau mau dukung ubah trail/date juga, panggil create+delete manual.
          if (formInitial?.date && formInitial?.trailId) {
            // EDIT reason saja
            const id = qClosures.data.items.find(
              (c) => c.trailId === formInitial.trailId && c.date.slice(0, 10) === formInitial.date
            )?.id;
            if (id) mUpdate.mutate({ id, reason: p.reason });
          } else {
            // CREATE
            mCreate.mutate(p);
          }
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Hapus Closure"
        message={
          toDelete ? (
            <>
              Hapus penutupan <b>{toDelete.trail?.name}</b> pada{' '}
              <b>{new Date(toDelete.date).toLocaleDateString('id-ID')}</b>?
              <div className="text-sm text-gray-600">
                {toDelete.bookingCount ?? 0} booking terkait.
              </div>
            </>
          ) : null
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
