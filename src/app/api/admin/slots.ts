// src/app/api/admin/slots.ts
import { api } from "../client";
import type { Page } from "@/types/api";
import type { AdminSlot } from "@/types/admin";

export type ListSlotsParams = {
  trailId?: string;
  from?: string;     
  to?: string;       
  page?: number;
  pageSize?: number;
};

export type BulkCreateSlotsPayload = {
  dates: string[];   
  quotaTotal: number;
};

export type BulkCreateSlotsResult = { ok: true; inserted: number };

export const slotsApi = {
  list: (p: ListSlotsParams) => {
    const usp = new URLSearchParams();
    if (p.trailId) usp.set("trailId", p.trailId);
    if (p.from) usp.set("from", p.from);
    if (p.to) usp.set("to", p.to);
    if (p.page) usp.set("page", String(p.page));
    if (p.pageSize) usp.set("pageSize", String(p.pageSize));
    return api<Page<AdminSlot>>(`/api/admin/slots?${usp.toString()}`);
  },

  bulkCreate: (trailId: string, payload: BulkCreateSlotsPayload) =>
    api<BulkCreateSlotsResult>(`/api/admin/slots/${trailId}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  updateQuota: (id: string, quotaTotal: number) =>
    api<AdminSlot>(`/api/admin/slots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotaTotal }),
    }),

  remove: (id: string) =>
    api(`/api/admin/slots/${id}`, { method: "DELETE" }).then(() => true as const),
};
