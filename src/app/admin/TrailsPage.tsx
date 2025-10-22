// src/app/admin/TrailsPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trailsApi } from '@/app/api/admin';
import type { AdminTrail, Page } from '@/types/api';
import TrailTable from './trails/TrailTable';
import TrailModal from './trails/TrailModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

function getErrMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e && 'message' in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return 'Terjadi kesalahan';
}

export default function TrailsPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminTrail | null>(null);

  const q = useQuery<Page<AdminTrail>>({
    queryKey: ['admin.trails'],
    queryFn: () => trailsApi.list({ active: 'all' }),
  });

  const mCreate = useMutation({
    mutationFn: trailsApi.create,
    onSuccess: () => { setShowModal(false); qc.invalidateQueries({ queryKey: ['admin.trails'] }); },
    onError: (e: unknown) => setErrMsg(getErrMessage(e)),
  });

  const mToggle = useMutation({
    mutationFn: (t: { id: string; isActive: boolean }) => trailsApi.setActive(t.id, !t.isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.trails'] }),
  });

  const mDelete = useMutation({
    mutationFn: trailsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.trails'] }),
  });

  if (q.isPending) return <div className="p-6">Loading…</div>;
  if (q.error) return <div className="p-6 text-red-600">Error: {(q.error as Error).message}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Trails</h2>
        <button className="border rounded px-3 py-2" onClick={() => { setErrMsg(null); setShowModal(true); }}>
          + New Trail
        </button>
      </div>

      <TrailTable
        items={q.data.items}
        onToggle={(t) => mToggle.mutate(t)}
        onRequestDelete={(t) => setToDelete(t)}
      />

      <TrailModal
        open={showModal}
        error={errMsg}
        submitting={mCreate.isPending}
        onClose={() => setShowModal(false)}
        onSubmit={(payload) => mCreate.mutate(payload)}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Hapus Trail"
        message={
          <>
            Hapus <b>{toDelete?.name}</b>?<br />
            <span className="text-gray-600 text-sm">
              Hanya bisa dihapus jika tidak memiliki Slot atau Booking.
            </span>
          </>
        }
        confirmText="Hapus"
        cancelText="Batal"
        loading={mDelete.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          mDelete.mutate(toDelete.id, {
            onSettled: () => setToDelete(null),
            onError: (e) => {
              // opsional: tampilkan error di banner modal create, atau bikin toast sendiri
              console.error(e);
            },
          });
        }}
      />
    </div>
  );
}
