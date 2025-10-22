// src/app/admin/payments/PaymentTable.tsx
import type { AdminPayment } from '@/types/admin';

export default function PaymentTable({
  items,
  onMarkPaid,
  onMarkRefund,
  loading,
}: {
  items: AdminPayment[];
  onMarkPaid: (p: AdminPayment) => void;
  onMarkRefund: (p: AdminPayment) => void;
  loading?: boolean;
}) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-[960px] w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Order</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Trail</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2 text-right">Amount</th>
            <th className="p-2">Pay Type</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2 font-mono">{p.booking.orderId}</td>
              <td className="p-2">{p.booking.user?.name ?? '-'} ({p.booking.user?.email ?? '-'})</td>
              <td className="p-2">{p.booking.trail?.name ?? '-'}</td>
              <td className="p-2 text-center">{new Date(p.booking.slot.date).toLocaleDateString('id-ID')}</td>
              <td className="p-2 text-right">Rp {p.grossAmount.toLocaleString('id-ID')}</td>
              <td className="p-2 text-center">{p.paymentType ?? '-'}</td>
              <td className="p-2 text-center">
                <span className="rounded px-2 py-1 bg-gray-100">{p.transactionStatus}</span>
              </td>
              <td className="p-2">
                <div className="flex gap-2 justify-center">
                  <button
                    className="border rounded px-2 py-1 disabled:opacity-50"
                    disabled={loading || p.transactionStatus === 'settlement'}
                    onClick={() => onMarkPaid(p)}
                  >
                    Mark Paid
                  </button>
                  <button
                    className="border rounded px-2 py-1 disabled:opacity-50"
                    disabled={loading || p.transactionStatus === 'refund'}
                    onClick={() => onMarkRefund(p)}
                  >
                    Mark Refunded
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={8} className="p-6 text-center text-gray-500">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
