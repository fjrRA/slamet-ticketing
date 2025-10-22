// src/app/user/check-quota/types.ts
export type Trail = { id: string; name: string };

export type Slot = {
  id: string;
  date: string;            // ISO string
  quotaTotal: number;
  quotaReserved: number;
  quotaPaid: number;
  remaining: number;
};

export type MemberMini = { fullName: string; idNumber: string };

// respons API kadang berupa array langsung, kadang { ok, data }
export type ApiEither<T> = T | { ok?: boolean; data?: T };
