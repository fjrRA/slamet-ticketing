// src/components/user/navbar/AccountMenu.tsx
// src/components/user/navbar/AccountMenu.tsx
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { Me } from '@/app/api/auth';

export default function AccountMenu({
  me,
  onLogout,
}: {
  me: Me;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  // Tutup saat klik di luar / tekan Esc
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (ev: PointerEvent) => {
      const node = rootRef.current;
      if (node && !node.contains(ev.target as Node)) setOpen(false);
    };
    const handleKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  async function handleLogout() {
    try {
      await onLogout();
    } finally {
      setOpen(false);
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="text-sm border rounded-lg px-3 py-1 hover:bg-slate-50 cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        Akun ▾
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow p-1"
        >
          {me && (
            <>
              <div className="px-3 py-2 text-xs text-slate-500">
                Masuk sebagai <b>{me.name ?? (me.role === 'ADMIN' ? 'Admin' : 'Pengguna')}</b>
              </div>
              <div className="h-px bg-slate-200 my-1" />
            </>
          )}

          <NavLink
            to="/me/bookings"
            className="block px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Pesanan Saya
          </NavLink>

          <NavLink
            to="/me"
            className="block px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Profil
          </NavLink>

          {me?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className="block px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Admin
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
            type="button"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
