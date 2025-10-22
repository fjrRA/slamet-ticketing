// src/components/admin/ConfirmDialog.tsx
import type { ReactNode } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  message,
  confirmText = 'OK',
  cancelText = 'Batal',
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: ReactNode;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-gray-500" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {message && <div className="text-sm text-gray-700">{message}</div>}

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2" onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
