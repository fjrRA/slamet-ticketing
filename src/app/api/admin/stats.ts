// src/app/api/admin/stats.ts
import { api } from "../client";
import type { AdminStats } from "@/types/api";

export function getAdminStats() {
  return api<AdminStats>("/api/admin/stats");
}

export const statsApi = {
  get: getAdminStats,
};
