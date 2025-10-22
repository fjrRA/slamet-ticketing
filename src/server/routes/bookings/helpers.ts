// src/server/routes/bookings/helpers.ts
// helper orderId
export function generateOrderId(seed: string) {
  const d = new Date();
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SLM-${ymd}-${seed.slice(0, 6).toUpperCase()}-${rnd}`;
}