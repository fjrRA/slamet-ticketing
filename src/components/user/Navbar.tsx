// src/components/user/Navbar.tsx
// src/components/user/Navbar.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMe } from '@/app/api/auth';
import { useNavData } from './navbar/useNavData';
import { useQueryClient } from '@tanstack/react-query';
import DesktopMenu from './navbar/DesktopMenu';
import AccountMenu from './navbar/AccountMenu';
import MobileDrawer from './navbar/MobileDrawer';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const { data: me } = useMe();
  const { trailList, hasAlert } = useNavData();
  const qc = useQueryClient();

  // dipanggil oleh AccountMenu & MobileDrawer
  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET', credentials: 'include' }).catch(() => { });
    // tutup drawer/menu & segarkan state user
    setOpenMenu(false);
    qc.invalidateQueries({ queryKey: ['me'] });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold">Slamet Ticketing</Link>
          <DesktopMenu trails={trailList} hasAlert={hasAlert} />
        </div>

        {/* Right actions (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {me ? (
            <AccountMenu me={me} onLogout={onLogout} />
          ) : (
            <>
              <Link to="/login" className="text-sm border rounded-lg px-3 py-1 hover:bg-slate-50">Masuk</Link>
              <Link to="/register" className="text-sm border rounded-lg px-3 py-1 hover:bg-slate-50">Daftar</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpenMenu(s => !s)} aria-label="Menu">☰</button>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        me={me ?? null}
        hasAlert={hasAlert}
        onLogout={onLogout}
      />
    </header>
  );
}
