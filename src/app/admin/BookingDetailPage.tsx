// src/app/admin/booking/BookingDetailPage.tsx
import { Link, useParams } from 'react-router-dom';
import { useBookingDetail } from './bookings/hooks/useBookingDetail';
import type { BookingDetail } from '@/types/api';
import StatusPartyActions from './bookings/StatusPartyActions';
import NotesField from './bookings/NotesField';
import SummaryGrid from './bookings/SummaryGrid';
import MembersBox from './bookings/MembersBox';

export default function BookingDetailPage() {
  const { id = '' } = useParams();
  const { q, patch, addMember, updateMember, deleteMember, checkinMember, checkinAll, isCheckingAll } =
    useBookingDetail(id);

  if (q.isPending) return <div className="p-6">Loading…</div>;
  if (q.error) return <div className="p-6 text-red-600">Error: {(q.error as Error).message}</div>;

  const b = q.data as BookingDetail;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Booking Detail</h2>
          <div className="text-sm text-gray-500">Order ID: {b.orderId}</div>
          <div className="text-sm text-gray-500">User: {b.user?.name} ({b.user?.email})</div>
        </div>
        <Link to="/admin/bookings" className="text-blue-600">← Kembali</Link>
      </div>

      <StatusPartyActions booking={b} onPatch={patch} onCheckAll={checkinAll} isCheckingAll={isCheckingAll} />

      <NotesField booking={b} onChangeNote={(note) => patch({ note })} />

      <SummaryGrid booking={b} />

      <MembersBox
        booking={b}
        onAdd={addMember}
        onUpdate={updateMember}
        onDelete={deleteMember}
        onCheckIn={checkinMember}
      />
    </div>
  );
}
