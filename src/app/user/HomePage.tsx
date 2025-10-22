// src/app/user/HomePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/client';

type Trail = { id: string; name: string; basecamp?: string | null };
type RespEither = { ok?: boolean; data?: Trail[] } | Trail[];

function unwrap(resp: RespEither | undefined): Trail[] {
  return Array.isArray(resp) ? resp : (resp?.data ?? []);
}

export default function HomePage() {
  const navigate = useNavigate();
  const [trailId, setTrailId] = useState('');
  const [date, setDate] = useState('');
  const [party, setParty] = useState(1);

  // ❗ endpoint publik, bukan /api/admin/...
  const trailsQ = useQuery({
    queryKey: ['public-trails-active'],
    queryFn: () => api<RespEither>('/api/trails?active=1'),
    staleTime: 60_000,
  });

  const list = unwrap(trailsQ.data);

  useEffect(() => {
    if (!trailId && list.length) setTrailId(list[0].id);
  }, [list, trailId]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!trailId || !date) return;
    navigate(`/book?trailId=${trailId}&date=${date}&party=${party}`);
  }

  return (
    <div className="min-h-screen">
      {/* Announcement */}
      {/* {!!closures.data?.data?.length && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-sm">
          {closures.data.data.slice(0, 1).map((c, i) => (
            <span key={i}>
              Penutupan jalur {c.trail.name} pada {new Date(c.date).toLocaleDateString('id-ID')}
              {c.reason ? ` — ${c.reason}` : ''}.
            </span>
          ))}
        </div>
      )} */}

      {/* Hero + Quick Search */}
      <section className="px-6 pt-10 pb-8 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Pesan Tiket Pendakian<br />Gunung Slamet
            </h1>
            <p className="mt-3 text-slate-600">
              Pilih jalur, tentukan tanggal, bayar aman via Midtrans. E-ticket dikirim otomatis.
            </p>
            <ul className="mt-3 text-sm text-slate-500 list-disc pl-5 space-y-1">
              <li>E-ticket bisa di-download</li>
            </ul>
          </div>

          <form onSubmit={onSearch} className="bg-white border rounded-2xl p-4 shadow-sm space-y-3">
            <div>
              <label className="block text-sm mb-1">Jalur</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={trailId}
                onChange={(e) => setTrailId(e.target.value)}
              >
                {list.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}{t.basecamp ? ` — ${t.basecamp}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Tanggal</label>
                <input type="date" className="w-full border rounded px-3 py-2"
                  value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Jumlah Orang</label>
                <input type="number" min={1} max={20} className="w-full border rounded px-3 py-2"
                  value={party} onChange={(e) => setParty(Number(e.target.value))} />
              </div>
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2">
              Cek Kuota
            </button>
            <p className="text-xs text-slate-500 text-center">
              E-ticket dikirim setelah pembayaran berhasil.
            </p>
          </form>
        </div>
      </section>

      {/* Trail cards */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-4">Jalur Pendakian</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {list.map(t => (
            <div key={t.id} className="border rounded-2xl p-4">
              <h3 className="font-medium">{t.name}</h3>
              {t.basecamp && <p className="text-sm text-slate-500">{t.basecamp}</p>}
              <button
                className="mt-3 text-emerald-700 hover:underline"
                onClick={() => navigate(`/book?trailId=${t.id}`)}
              >
                Cek Kuota →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}