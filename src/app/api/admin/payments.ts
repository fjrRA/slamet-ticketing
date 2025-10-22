// src/app/api/admin/payments.ts
import { api } from "../client";
import type { AdminPayment, AdminPaymentPage } from "@/types/admin";

export type ListPaymentsParams = {
  q?: string;
  status?: string;   
  from?: string;     
  to?: string;      
  page?: number;
  pageSize?: number;
};

export const paymentsApi = {
  list: (p: ListPaymentsParams) => {
    const usp = new URLSearchParams();
    if (p.q) usp.set("q", p.q);
    if (p.status) usp.set("status", p.status);
    if (p.from) usp.set("from", p.from);
    if (p.to) usp.set("to", p.to);
    if (p.page) usp.set("page", String(p.page));
    if (p.pageSize) usp.set("pageSize", String(p.pageSize));
    return api<AdminPaymentPage>(`/api/admin/payments?${usp.toString()}`);
  },

  markPaid: (id: string) =>
    api<{ ok: true; data: AdminPayment }>(
      `/api/admin/payments/${id}/mark-paid`,
      { method: "POST" }
    ),

  markRefunded: (id: string) =>
    api<{ ok: true; data: AdminPayment }>(
      `/api/admin/payments/${id}/mark-refunded`,
      { method: "POST" }
    ),
};
