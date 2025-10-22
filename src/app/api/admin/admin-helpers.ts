// src/app/api/admin/admin-helpers.ts

// Bentuk respons yang mungkin: langsung T atau { ok?, data: T }
export type MaybeData<T> = T | { ok?: boolean; data: T };

export function hasData<T>(x: unknown): x is { data: T } {
  return typeof x === "object" && x !== null && "data" in x;
}

export function unwrap<T>(x: MaybeData<T>): T {
  return hasData<T>(x) ? x.data : (x as T);
}
