// src/components/user/navbar/TrailsDropdown.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { Trail } from './useNavData';

export default function TrailsDropdown({ trails }: { trails: Trail[] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // click outside + Esc to close
  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocDown, true);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocDown, true);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="text-sm hover:underline"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Jalur ▾
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-50 mt-2 w-56 bg-white border rounded-xl shadow-lg p-2 cursor-pointer"
        >
          {trails.length > 0 ? (
            <>
              {trails.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="menuitem"
                  className="w-full text-left text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/book?trailId=${t.id}`);
                  }}
                >
                  {t.name}{t.basecamp ? ` — ${t.basecamp}` : ''}
                </button>
              ))}
              <NavLink
                to="/trails"
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Lihat semua jalur →
              </NavLink>
            </>
          ) : (
            <div className="text-sm text-slate-500 px-3 py-2">Belum ada jalur aktif.</div>
          )}
        </div>
      )}
    </div>
  );
}
