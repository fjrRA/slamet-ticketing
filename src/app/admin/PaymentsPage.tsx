// src/app/admin/PaymentsPage.tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/app/api/admin';
import type { AdminPaymentPage } from '@/types/admin';
import PaymentTable from './payments/PaymentTable';

function getErrMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e && 'message' in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return 'Terjadi kesalahan';
}

export default function PaymentsPage() {
  const qc = useQueryClient();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const pageSize = 20;

  const query = useQuery<AdminPaymentPage>({
    queryKey: ['admin.payments', { q, status, from, to, page, pageSize }],
    queryFn: () => paymentsApi.list({ q: q || undefined, status: status || undefined, from: from || undefined, to: to || undefined, page, pageSize }),
  });

  const mPaid = useMutation({
    mutationFn: (id: string) => paymentsApi.markPaid(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.payments'] }),
  });
  const mRefund = useMutation({
    mutationFn: (id: string) => paymentsApi.markRefunded(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.payments'] }),
  });

  if (query.isPending) return <div className="p-6">Loading…</div>;
  if (query.error) return <div className="p-6 text-red-600">Error: {getErrMessage(query.error)}</div>;

  const data = query.data!;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-sm mb-1">Cari</label>
          <input className="border rounded px-3 py-2" placeholder="orderId / transactionId / user"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">(Semua)</option>
            <option value="pending">pending</option>
            <option value="capture">capture</option>
            <option value="settlement">settlement</option>
            <option value="expire">expire</option>
            <option value="cancel">cancel</option>
            <option value="deny">deny</option>
            <option value="refund">refund</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">From</label>
          <input type="date" className="border rounded px-3 py-2" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">To</label>
          <input type="date" className="border rounded px-3 py-2" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      <PaymentTable
        items={data.items}
        onMarkPaid={(p) => mPaid.mutate(p.id)}
        onMarkRefund={(p) => mRefund.mutate(p.id)}
        loading={mPaid.isPending || mRefund.isPending}
      />

      {/* pagination */}
      <div className="flex items-center justify-end gap-2">
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >Prev</button>
        <span className="text-sm">Page {data.page}</span>
        <button className="border rounded px-3 py-1 disabled:opacity-50"
          disabled={(data.page * data.pageSize) >= data.total}
          onClick={() => setPage(p => p + 1)}
        >Next</button>
      </div>
    </div>
  );
}
