// src/app/user/OrderDetailPage.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/client';
import { useParams } from 'react-router-dom';
import PayButton from './PayButton';

type BookingDetail = {
  ok: true;
  data: {
    id: string;
    orderId: string;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
    total: number;
    slot: { date: string };
    trail: { name: string };
    payment?: { transactionStatus?: string; paymentType?: string; grossAmount?: number };
  }
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const q = useQuery({
    queryKey: ['booking', orderId],
    queryFn: () => api<BookingDetail>(`/api/bookings/${orderId}`),
    enabled: !!orderId,
  });

  if (q.isLoading) return <div className="p-6">Memuat...</div>;
  if (q.isError || !q.data?.data) return <div className="p-6 text-red-600">Gagal memuat</div>;

  const b = q.data.data;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Detail Pesanan</h1>
      <div className="rounded-xl border p-4">
        <div className="flex justify-between">
          <p>Order ID</p><p className="font-mono">{b.orderId}</p>
        </div>
        <div className="flex justify-between">
          <p>Jalur / Tanggal</p>
          <p>{b.trail.name} — {new Date(b.slot.date).toLocaleDateString('id-ID')}</p>
        </div>
        <div className="flex justify-between">
          <p>Total</p><p>Rp {b.total.toLocaleString('id-ID')}</p>
        </div>
        <div className="flex justify-between">
          <p>Status</p><p className="font-semibold">{b.status}</p>
        </div>
      </div>

      {b.status === 'PENDING' && (
        <div className="flex items-center gap-3">
          <PayButton bookingId={b.id} />
          <span className="text-sm text-slate-500">
            Lanjutkan pembayaran untuk menyelesaikan pesanan.
          </span>
        </div>
      )}
    </div>
  );
}
