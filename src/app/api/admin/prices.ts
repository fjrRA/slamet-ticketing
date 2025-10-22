// src/app/api/admin/prices.ts
import { api } from "../client";
import type { Page } from "@/types/api";
import type { AdminPrice } from "@/types/admin";

export type ListPricesParams = {
  trailId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type CreatePricePayload = {
  trailId: string;
  startDate: string;        // 'YYYY-MM-DD'
  endDate: string;          // 'YYYY-MM-DD'
  priceLocal: number;
  priceNonLocal: number;
  weekendMultiplier?: number;
  seasonLabel?: string | null;
};

export type UpdatePricePayload = Partial<{
  startDate: string;
  endDate: string;
  priceLocal: number;
  priceNonLocal: number;
  weekendMultiplier: number;
  seasonLabel: string | null;
}>;

export const pricesApi = {
  list: (p: ListPricesParams) => {
    const usp = new URLSearchParams();
    if (p.trailId) usp.set("trailId", p.trailId);
    if (p.from) usp.set("from", p.from);
    if (p.to) usp.set("to", p.to);
    if (p.page) usp.set("page", String(p.page));
    if (p.pageSize) usp.set("pageSize", String(p.pageSize));
    return api<Page<AdminPrice>>(`/api/admin/prices?${usp.toString()}`);
  },

  create: (payload: CreatePricePayload) =>
    api<AdminPrice>(`/api/admin/prices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdatePricePayload) =>
    api<AdminPrice>(`/api/admin/prices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    api(`/api/admin/prices/${id}`, { method: "DELETE" }).then(() => true as const),
};
