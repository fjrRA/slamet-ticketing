// src/app/user/TrailsListPage.tsx
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/app/api/client';

type Trail = { id: string; name: string; basecamp: string | null; isActive: boolean };

export default function TrailsListPage() {
  const q = useQuery({
    queryKey: ['public-trails'],
    queryFn: () => apiGet<Trail[]>('/api/trails/list?active=1'),
    staleTime: 60_000,
  });

  if (q.isLoading) return <div className="p-6">Memuat jalur…</div>;
  if (q.error) return <div className="p-6 text-red-600">Gagal memuat jalur</div>;

  const data = q.data ?? [];
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Daftar Jalur Pendakian</h1>
      <ul className="space-y-2">
        {data.map(t => (
          <li key={t.id} className="border rounded p-3 flex justify-between">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-neutral-600">{t.basecamp ?? '—'}</div>
            </div>
            {t.isActive ? (
              <span className="text-green-600 text-sm">Aktif</span>
            ) : (
              <span className="text-neutral-500 text-sm">Nonaktif</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
