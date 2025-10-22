// src/app/admin/DashboardPage.tsx
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/admin";
import type { AdminStats } from "../../types/api";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["admin.stats"],
    queryFn: adminApi.stats,
    staleTime: 10_000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Gagal memuat: {(error as Error).message}</p>;
  if (!data) return null;

  const cards = [
    { label: "Pending", value: data.pending },
    { label: "Paid", value: data.paid },
    { label: "Booking Hari Ini", value: data.today },
    { label: "Revenue (Paid)", value: new Intl.NumberFormat("id-ID").format(data.revenue) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border p-4 shadow-sm bg-white">
            <p className="text-gray-500 text-sm">{c.label}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500">Buka tab Bookings untuk filter, cari, dan update status.</p>
    </div>
  );
}
