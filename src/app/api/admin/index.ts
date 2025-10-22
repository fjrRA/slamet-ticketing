// src/app/api/admin/index.ts

// ---- Re-export fungsi & tipe per sub-modul ----
export * from "./bookings.ts";
export * from "./trails.ts";
export * from "./slots.ts";
export * from "./prices.ts";
export * from "./closures.ts";
export * from "./payments.ts";
export * from "./users.ts";
export * from "./stats.ts";

// ---- Optional namespace exports ----
export { trailsApi }   from "./trails.ts";
export { slotsApi }    from "./slots.ts";
export { pricesApi }   from "./prices.ts";
export { closuresApi } from "./closures.ts";
export { paymentsApi } from "./payments.ts";
export { usersApi }    from "./users.ts";
export { statsApi }    from "./stats.ts";

// ---- Admin API agregat sederhana (untuk compat lama) ----
import { listBookings, updateBookingStatus } from "./bookings.ts";
import { getAdminStats } from "./stats.ts";

export const adminApi = {
  stats: getAdminStats,
  listBookings,
  updateBookingStatus,
};
