// src/app/api/admin/closures.ts
import { api } from "../client";
import type { Page } from "@/types/api";
import type { AdminClosure } from "@/types/admin";


export type ListClosuresParams = {
  trailId?: string;
  from?: string;     
  to?: string;       
  page?: number;
  pageSize?: number;
};

export type CreateClosurePayload = {
  trailId: string;
  date: string;      
  reason?: string | null;
  force?: boolean;
};

export type UpdateClosurePayload = {
  reason?: string | null;
};

export const closuresApi = {
  list: (p: ListClosuresParams) => {
    const usp = new URLSearchParams();
    if (p.trailId) usp.set("trailId", p.trailId);
    if (p.from) usp.set("from", p.from);
    if (p.to) usp.set("to", p.to);
    if (p.page) usp.set("page", String(p.page));
    if (p.pageSize) usp.set("pageSize", String(p.pageSize));
    return api<Page<AdminClosure>>(`/api/admin/closures?${usp.toString()}`);
  },

  create: (payload: CreateClosurePayload) =>
    api<AdminClosure>("/api/admin/closures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateClosurePayload) =>
    api<AdminClosure>(`/api/admin/closures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    api(`/api/admin/closures/${id}`, { method: "DELETE" }).then(() => true),
};
