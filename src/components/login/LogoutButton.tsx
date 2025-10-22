// src/components/login/LogoutButton.tsx
import { useLogout } from '@/app/api/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function LogoutButton() {
  const logout = useLogout();
  const navigate = useNavigate();

  async function onClick() {
    try {
      await logout.mutateAsync();
      toast.success('Anda telah keluar');
      navigate('/login', { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal logout';
      toast.error(msg);
    }
  }

  return (
    <button
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 border hover:bg-slate-50 text-slate-700"
      aria-label="Keluar"
    >
      <span>Keluar</span>
    </button>
  );
}
