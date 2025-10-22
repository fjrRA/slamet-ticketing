// src/types/admin.ts
import type { BookingStatus } from './api';
export type Role = 'USER' | 'ADMIN';

export type AdminTrail = {
  id: string;
  name: string;
  basecamp?: string | null;
  isActive: boolean;
  _count: { slots: number; bookings: number };
};

export type AdminSlot = {
  id: string;
  trailId: string;
  date: string;
  quotaTotal: number;
  quotaReserved: number;
  quotaPaid: number;
  trail?: { id: string; name: string } | null;
  _count: { bookings: number };
};

export type AdminPrice = {
  id: string;
  trailId: string;
  startDate: string; // ISO date string
  endDate: string;
  priceLocal: number;
  priceNonLocal: number;
  weekendMultiplier: number;
  seasonLabel?: string | null;
  trail?: { id: string; name: string } | null;
};

export type AdminClosure = {
  id: string;
  trailId: string;
  date: string;
  reason?: string | null;
  createdAt: string;
  trail: { id: string; name: string };
  bookingCount: number; 
};

export type AdminPayment = {
  id: string;
  bookingId: string;
  transactionId?: string | null;
  grossAmount: number;
  paymentType?: string | null;
  transactionStatus: string; // mengikuti kolom prisma (string bebas)
  fraudStatus?: string | null;
  settledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // ringkasan relasi booking
  booking: {
    id: string;
    orderId: string;
    status: BookingStatus;
    user: { id: string; name: string; email: string | null };
    trail: { id: string; name: string };
    slot: { date: string }; // ISO
  };
};

export type AdminPaymentPage = {
  page: number;
  pageSize: number;
  total: number;
  items: AdminPayment[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
  _count: { bookings: number };
};

export type AdminUserUpdate = {
  name?: string;
  phone?: string | null;
};