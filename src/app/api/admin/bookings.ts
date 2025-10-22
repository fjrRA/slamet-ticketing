// src/app/api/admin/bookings.ts
import { api } from "../client";
import type { Booking, BookingStatus, BookingDetail, Page } from "@/types/api";
import { unwrap, type MaybeData } from "./admin-helpers";

export function listBookings(p: { status?: BookingStatus; q?: string; page?: number; pageSize?: number }) {
  const usp = new URLSearchParams();
  if (p.status) usp.set("status", p.status);
  if (p.q) usp.set("q", p.q);
  if (p.page) usp.set("page", String(p.page));
  if (p.pageSize) usp.set("pageSize", String(p.pageSize));
  return api<Page<Booking>>(`/api/admin/bookings?${usp.toString()}`);
}

export function updateBookingStatus(orderId: string, status: BookingStatus) {
  return api<{ ok: true; booking: Booking }>(`/api/admin/bookings/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function getBookingDetail(id: string) {
  const json = await api<MaybeData<BookingDetail>>(`/api/admin/bookings/${id}`);
  return unwrap(json);
}

export type PatchBookingPayload = {
  status?: BookingStatus;
  note?: string | null;
  partySize?: number;
};

export function patchBooking(id: string, data: PatchBookingPayload) {
  return api<Booking>(`/api/admin/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export type MemberPayload = {
  fullName: string;
  idNumber: string;
  birthdate?: string;
  gender?: string;
  city?: string;
};

export function createMember(bookingId: string, payload: MemberPayload) {
  return api(`/api/admin/bookings/${bookingId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateMember(bookingId: string, memberId: string, payload: Partial<MemberPayload>) {
  return api(`/api/admin/bookings/${bookingId}/members/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteMember(bookingId: string, memberId: string) {
  return api(`/api/admin/bookings/${bookingId}/members/${memberId}`, { method: "DELETE" }).then(() => true);
}

export function checkinMember(bookingId: string, memberId: string) {
  return api(`/api/admin/bookings/${bookingId}/members/${memberId}/checkin`, { method: "POST" });
}

export function checkinAll(bookingId: string) {
  return api<{ ok: true; count: number }>(`/api/admin/bookings/${bookingId}/checkin-all`, { method: "POST" })
    .then(r => r.count);
}
