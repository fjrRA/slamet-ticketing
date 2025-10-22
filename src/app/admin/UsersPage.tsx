// src/app/admin/UsersPage.tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { usersApi } from '@/app/api/admin';
import type { Page } from '@/types/api';
import type { AdminUser } from '@/types/admin';
import UserTable from './users/UserTable';
import UserModal from './users/UserModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

function getErrMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e && 'message' in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return 'Terjadi kesalahan';
}

export default function UsersPage() {
  const qc = useQueryClient();

  // filters & pagination
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  // dialogs & banners
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [toRole, setToRole] = useState<AdminUser | null>(null);
  const [toReset, setToReset] = useState<AdminUser | null>(null);
  const [resetResult, setResetResult] = useState<string | null>(null);

  const qUsers = useQuery<Page<AdminUser>>({
    queryKey: ['admin.users', { q, page }],
    queryFn: () => usersApi.list({ q: q || undefined, page }),
    placeholderData: keepPreviousData,
  });

  const mUpdate = useMutation({
    mutationFn: (p: { id: string; payload: { name: string; phone?: string | null } }) =>
      usersApi.update(p.id, p.payload),
    onSuccess: () => { setEditUser(null); qc.invalidateQueries({ queryKey: ['admin.users'] }); },
    onError: (e: unknown) => setErrMsg(getErrMessage(e)),
  });

  const mRole = useMutation({
    mutationFn: (p: { id: string; role: 'USER' | 'ADMIN' }) => usersApi.setRole(p.id, p.role),
    onSuccess: () => { setToRole(null); qc.invalidateQueries({ queryKey: ['admin.users'] }); },
    onError: (e: unknown) => setErrMsg(getErrMessage(e)),
  });

  const mReset = useMutation({
    mutationFn: (id: string) => usersApi.resetPassword(id),
    onSuccess: (r) => { setToReset(null); setResetResult(r.tempPassword); },
    onError: (e: unknown) => setErrMsg(getErrMessage(e)),
  });

  if (qUsers.isPending) return <div className="p-6">Loading…</div>;
  if (qUsers.error) return <div className="p-6 text-red-600">Error: {(qUsers.error as Error).message}</div>;

  const data = qUsers.data;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Users</h2>
        <input
          className="ml-auto border rounded px-3 py-2"
          placeholder="Cari nama/email/phone"
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1); }}
        />
      </div>

      {resetResult && (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-center justify-between">
          <div>
            <b>Password sementara:</b> <code className="px-1">{resetResult}</code>
            <span className="ml-2">Beritahukan ke user dan minta segera ganti.</span>
          </div>
          <button className="ml-3 text-amber-900 underline" onClick={() => setResetResult(null)}>Tutup</button>
        </div>
      )}

      <UserTable
        items={data.items}
        onEdit={(u) => { setErrMsg(null); setEditUser(u); }}
        onToggleRole={(u) => setToRole(u)}
        onResetPassword={(u) => setToReset(u)}
      />

      {/* pagination */}
      <div className="flex items-center justify-end gap-2">
        <button
          className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >Prev</button>
        <span className="text-sm">Page {data.page}</span>
        <button
          className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={(data.page * data.pageSize) >= data.total}
          onClick={() => setPage(p => p + 1)}
        >Next</button>
      </div>

      {/* edit modal */}
      <UserModal
        open={!!editUser}
        initial={editUser ?? undefined}
        submitting={mUpdate.isPending}
        error={errMsg}
        onClose={() => setEditUser(null)}
        onSubmit={(payload) => {
          if (!editUser) return;
          mUpdate.mutate({ id: editUser.id, payload });
        }}
      />

      {/* confirm role change */}
      <ConfirmDialog
        open={!!toRole}
        title="Ubah Role"
        message={
          toRole ? (
            <>
              Ubah role <b>{toRole.name}</b> ({toRole.email}) menjadi{' '}
              <b>{toRole.role === 'ADMIN' ? 'USER' : 'ADMIN'}</b>?
            </>
          ) : null
        }
        confirmText="Ubah"
        cancelText="Batal"
        loading={mRole.isPending}
        onClose={() => setToRole(null)}
        onConfirm={() => {
          if (!toRole) return;
          const next = toRole.role === 'ADMIN' ? 'USER' : 'ADMIN';
          mRole.mutate({ id: toRole.id, role: next });
        }}
      />

      {/* confirm reset password */}
      <ConfirmDialog
        open={!!toReset}
        title="Reset Password"
        message={
          toReset ? (
            <>
              Reset password untuk <b>{toReset.name}</b> ({toReset.email})?
              <div className="text-sm text-gray-600 mt-1">
                Sistem akan membuat password sementara baru.
              </div>
            </>
          ) : null
        }
        confirmText="Reset"
        cancelText="Batal"
        loading={mReset.isPending}
        onClose={() => setToReset(null)}
        onConfirm={() => { if (toReset) mReset.mutate(toReset.id); }}
      />
    </div>
  );
}
