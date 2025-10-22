// src/app/user/MyBookingsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/client';
import PayButton from './PayButton';
import { Link } from 'react-router-dom';

type Row = {
  id: string;
  orderId: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
  total: number;
  createdAt: string;
  slot: { date: string };
  trail: { name: string };
};

type Resp = { ok: true; data: Row[] };

export default function MyBookingsPage() {
  const q = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api<Resp>('/api/bookings/me'),
  });

  if (q.isLoading) return <div className="p-6">Memuat…</div>;
  if (q.isError) return <div className="p-6 text-red-600">Gagal memuat</div>;

  const rows = q.data?.data ?? [];

  if (!rows.length) return <div className="p-6">Belum ada pesanan.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pesanan Saya</h1>
      <div className="divide-y border rounded-xl">
        {rows.map((r) => (
          <div key={r.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="font-medium">
                <Link to={`/order/${r.orderId}`} className="underline">{r.orderId}</Link>
              </div>
              <div className="text-sm text-slate-600">
                {r.trail.name} — {new Date(r.slot.date).toLocaleDateString('id-ID')}
              </div>
              <div className="text-sm">
                Total: Rp {r.total.toLocaleString('id-ID')} • Status: <b>{r.status}</b>
              </div>
            </div>
            <div className="flex gap-2">
              {r.status === 'PENDING' && <PayButton bookingId={r.id} />}
              {r.status === 'PAID' && (
                <a
                  className="px-4 py-2 rounded bg-emerald-600 text-white"
                  href={`/api/bookings/${r.orderId}/ticket`}
                  download={`${r.orderId}.pdf`}
                >
                  Download Tiket
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
