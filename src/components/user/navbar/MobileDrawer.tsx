// src/components/user/navbar/MobileDrawer.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import type { Me } from '@/app/api/auth';

export default function MobileDrawer({
  open,
  onClose,
  me,
  hasAlert,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  me: Me;
  hasAlert: boolean;
  onLogout: () => Promise<void>;
}) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="md:hidden border-t bg-white">
      <nav className="px-4 py-3 flex flex-col gap-2">
        <NavLink to="/trails" onClick={onClose}>Jalur</NavLink>
        <button onClick={() => { onClose(); navigate('/book'); }}>Cek Kuota</button>
        <NavLink to="/order" onClick={onClose}>Lacak Pesanan</NavLink>

        {hasAlert && (
          <span className="text-xs mt-1 px-2 py-1 rounded bg-amber-100 text-amber-800">Pengumuman</span>
        )}

        <div className="h-px bg-slate-200 my-2" />

        {me ? (
          <>
            <NavLink to="/me/bookings" onClick={onClose}>Pesanan Saya</NavLink>
            <NavLink to="/me" onClick={onClose}>Profil</NavLink>
            {me.role === 'ADMIN' && <NavLink to="/admin" onClick={onClose}>Admin</NavLink>}
            <button
              onClick={async () => { await onLogout(); onClose(); }}
              className="text-left"
            >
              Keluar
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={onClose}>Masuk</NavLink>
            <NavLink to="/register" onClick={onClose}>Daftar</NavLink>
          </>
        )}
      </nav>
    </div>
  );
}
