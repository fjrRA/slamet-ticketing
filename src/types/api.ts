// src/types/api.ts
export type User = { id: string; name: string; email: string; phone?: string | null };
export type TimeSlot = { id: string; date: string; quotaTotal: number; quotaReserved: number; quotaPaid: number };
export type Payment = { id: string; transactionStatus?: string | null; paymentType?: string | null; grossAmount: number };
export type BookingStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUNDED";

export type Trail = {
  id: string;
  name: string;
  mountainName: string;
  basecamp?: string | null;
  maxGroupSize?: number | null;
  basecampCode?: string | null;
  isActive: boolean;                 // ⬅️ NEW
};

export type Booking = {
  id: string;
  orderId: string;
  user: User;
  trail: Trail;
  slot: TimeSlot;
  partySize: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  payment?: Payment | null;
};

export type BookingMember = {
  id: string;
  bookingId: string;
  fullName: string;
  idNumber: string;
  birthdate?: string | null;
  gender?: string | null;
  city?: string | null;
  checkedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingDetail = Booking & {
  note?: string | null;
  members: BookingMember[];
};

export type AdminTrail = Trail & {   // untuk tabel admin dengan ringkasan relasi
  _count: { slots: number; bookings: number };
};

export type AdminStats = { pending: number; paid: number; today: number; revenue: number };

export type Page<T> = { page: number; pageSize: number; total: number; items: T[] };
