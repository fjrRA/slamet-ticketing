// src/components/login/LoginRequiredDialog.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  returnTo: string;
};

export default function LoginRequiredDialog({ open, onClose, returnTo }: Props) {
  const nav = useNavigate();

  // tutup dengan ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const rt = encodeURIComponent(returnTo);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">Masuk dulu ya</h3>
        <p className="text-sm text-slate-600">
          Untuk melanjutkan pemesanan, kamu perlu masuk terlebih dahulu.
          Setelah masuk, kami akan mengembalikan kamu ke halaman ini.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            className="px-3 py-2 rounded-lg border"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-lg border"
            onClick={() => nav(`/register?returnTo=${rt}`)}
          >
            Daftar
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-lg bg-blue-600 text-white"
            onClick={() => nav(`/login?returnTo=${rt}`)}
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
