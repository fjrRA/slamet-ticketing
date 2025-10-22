// src/app/admin/users/UserModal.tsx
import { useEffect, useState } from 'react';
import type { AdminUser } from '@/types/admin';

export default function UserModal({
  open,
  initial,
  submitting,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initial?: Pick<AdminUser, 'name' | 'phone'>;
  submitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: { name: string; phone?: string | null }) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setPhone(initial?.phone ?? '');
    }
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit User</h3>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        {error && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="grid gap-3">
          <div>
            <label className="block text-sm mb-1">Name *</label>
            <input className="w-full rounded border px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input className="w-full rounded border px-3 py-2" value={phone ?? ''} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={submitting}>Cancel</button>
          <button
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            onClick={() => onSubmit({ name: name.trim(), phone: phone.trim() ? phone.trim() : null })}
            disabled={submitting || name.trim().length < 2}
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
