// src/app/api/admin/trails.ts
import { api } from "../client";
import type { AdminTrail } from "@/types/api";

export type TrailListParams = {
  q?: string;
  active?: "all" | "true" | "false";
  page?: number;
  pageSize?: number;
};

export function listTrails(p: TrailListParams = {}) {
  const usp = new URLSearchParams();
  if (p.q) usp.set("q", p.q);
  if (p.active) usp.set("active", p.active);
  if (p.page) usp.set("page", String(p.page));
  if (p.pageSize) usp.set("pageSize", String(p.pageSize));

  return api<{ page: number; pageSize: number; total: number; items: AdminTrail[] }>(
    `/api/admin/trails?${usp.toString()}`
  );
}

export function createTrail(payload: Partial<AdminTrail>) {
  return api<AdminTrail>(`/api/admin/trails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateTrail(id: string, payload: Partial<AdminTrail>) {
  return api<AdminTrail>(`/api/admin/trails/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function setTrailActive(id: string, isActive: boolean) {
  return api<AdminTrail>(`/api/admin/trails/${id}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
}

export function deleteTrail(id: string) {
  return api(`/api/admin/trails/${id}`, { method: "DELETE" }).then(() => true);
}

export const trailsApi = {
  list: listTrails,
  create: createTrail,
  update: updateTrail,
  setActive: setTrailActive,
  remove: deleteTrail,
};
