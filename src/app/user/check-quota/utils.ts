// src/app/user/check-quota/utils.ts
import type { ApiEither } from "./types";

export function unwrap<T>(resp: ApiEither<T> | null | undefined, fallback: T): T {
  if (resp == null) return fallback;
  if (typeof resp === "object" && "data" in resp) {
    const r = resp as { data?: T };
    return r.data ?? fallback;
  }
  return resp as T;
}

export function addDaysISO(d: Date, days: number): string {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x.toISOString().slice(0, 10);
}
