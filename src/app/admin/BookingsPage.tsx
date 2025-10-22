// src/app/admin/BookingsPage.tsx
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { adminApi } from "../api/admin";
import type { Booking, BookingStatus, Page } from "../../types/api";
import BookingFilters from "../../components/admin/BookingFilters";
import BookingTable from "../../components/admin/BookingTable";
import { toast } from "sonner";

export default function BookingsPage() {
  const qc = useQueryClient();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [page, setPage] = useState(1);
  const [mutatingOrderId, setMutatingOrderId] = useState<string | null>(null);
  const pageSize = 20;

  const { data, isLoading, error, isFetching } = useQuery<Page<Booking>, Error>({
    queryKey: ["admin.bookings", { q, status, page, pageSize }],
    queryFn: () => adminApi.listBookings({
      q: q || undefined,
      status: status || undefined,
      page,
      pageSize,
    }),
    placeholderData: keepPreviousData,
  });

  const mutateStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: BookingStatus }) =>
      adminApi.updateBookingStatus(orderId, status),
    onMutate: ({ orderId }) => {
      setMutatingOrderId(orderId);
    },
    onSuccess: () => {
      toast.success("Status booking diperbarui");
      qc.invalidateQueries({ queryKey: ["admin.bookings"] });
      qc.invalidateQueries({ queryKey: ["admin.stats"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status";
      toast.error(msg);
    },
    onSettled: () => {
      setMutatingOrderId(null);
    }
  });

  const rows = useMemo(() => data?.items ?? [], [data]);

  function handleFilterChange(next: { q?: string; status?: BookingStatus | ""; resetPage?: boolean }) {
    if (typeof next.q !== "undefined") setQ(next.q);
    if (typeof next.status !== "undefined") setStatus(next.status);
    if (next.resetPage) setPage(1);
  }

  function handleAction(orderId: string, target: BookingStatus) {
    mutateStatus.mutate({ orderId, status: target });
  }

  const total = data?.total ?? 0;
  const canPrev = page > 1;
  const canNext = data ? (page * data.pageSize) < total : false;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bookings</h2>

      <BookingFilters q={q} status={status} onChange={handleFilterChange} />

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Gagal memuat: {(error as Error).message}</p>}

      <BookingTable
        items={rows}
        onAction={handleAction}
        isMutating={mutateStatus.isPending}
        mutatingOrderId={mutatingOrderId}
      />

      {!!data && (
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
            disabled={!canPrev || isFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {data.page} • Total {total}
          </span>

          <button
            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
            disabled={!canNext || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
