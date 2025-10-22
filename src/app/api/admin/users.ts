// src/app/api/admin/users.ts
import { api } from "../client";
import type { Page } from "@/types/api";
import type { AdminUser, AdminUserUpdate, Role } from "@/types/admin";

export type UserListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export function listUsers(p: UserListParams = {}) {
  const usp = new URLSearchParams();
  if (p.q) usp.set("q", p.q);
  if (p.page) usp.set("page", String(p.page));
  if (p.pageSize) usp.set("pageSize", String(p.pageSize));
  return api<Page<AdminUser>>(`/api/admin/users?${usp.toString()}`);
}

export function updateUser(id: string, payload: AdminUserUpdate) {
  return api<{ ok: true; data: AdminUser }>(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function setUserRole(id: string, role: Role) {
  return api<{ ok: true; data: AdminUser }>(`/api/admin/users/${id}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

export function resetUserPassword(id: string) {
  return api<{ ok: true; tempPassword: string }>(`/api/admin/users/${id}/reset-password`, {
    method: "POST",
  });
}

/** Optional namespace export */
export const usersApi = {
  list: listUsers,
  update: updateUser,
  setRole: setUserRole,
  resetPassword: resetUserPassword,
};
