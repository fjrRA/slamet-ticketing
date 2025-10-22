// src/app/user/OrderFindPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMe } from '@/app/api/auth';

export default function OrderFindPage() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  const meQ = useMe();

  if (meQ.isLoading) return <div className="p-6">Memuat…</div>;

  // Belum login → tampilkan pesan
  if (!meQ.data) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-3">Lacak Pesanan</h1>
        <p className="text-slate-700">
          Mohon <Link to="/login" className="text-emerald-700 underline">masuk</Link> untuk melihat pesanan.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Belum punya akun? <Link to="/register" className="underline">Daftar</Link>
        </p>
      </div>
    );
  }

  // Sudah login → pakai form lacak seperti versi kamu
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Lacak Pesanan</h1>
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Masukkan Order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        />
        <button
          className="bg-slate-900 text-white rounded-xl px-4"
          onClick={() => orderId && navigate(`/order/${orderId}`)}
        >
          Lacak
        </button>
      </div>
    </div>
  );
}
