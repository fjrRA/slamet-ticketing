// src/components/user/navbar/DesktopMenu.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import TrailsDropdown from './TrailsDropdown';
import type { Trail } from './useNavData';

export default function DesktopMenu({ trails, hasAlert }: { trails: Trail[]; hasAlert: boolean }) {
  const navigate = useNavigate();
  return (
    <nav className="hidden md:flex items-center gap-4">
      <TrailsDropdown trails={trails} />
      <button className="text-sm hover:underline" onClick={() => navigate('/book')}>Cek Kuota</button>
      <NavLink to="/order" className="text-sm hover:underline">Lacak Pesanan</NavLink>
      {hasAlert && (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Pengumuman
        </span>
      )}
    </nav>
  );
}
