// src/app/api/client.ts
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? '';
const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type JsonBody = Record<string, unknown> | unknown[] | string | number | boolean | null;
type Bodyish =
  | JsonBody
  | FormData
  | Blob
  | URLSearchParams
  | ArrayBuffer
  | ReadableStream<Uint8Array>
  | ArrayBufferView
  | null
  | undefined;

function isJsonBody(b: Bodyish): b is JsonBody {
  if (b === null || b === undefined) return false;
  if (typeof b === 'string' || typeof b === 'number' || typeof b === 'boolean') return true;
  if (b instanceof FormData) return false;
  if (b instanceof Blob) return false;
  if (b instanceof URLSearchParams) return false;
  if (b instanceof ArrayBuffer) return false;
  if (typeof ReadableStream !== 'undefined' && b instanceof ReadableStream) return false;
  if (ArrayBuffer.isView(b as ArrayBufferView)) return false;
  return true;
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Bodyish;
  headers?: Record<string, string>;
};

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const headers = new Headers(opts.headers);

  if (import.meta.env.DEV && ADMIN_TOKEN) headers.set('X-Admin-Token', ADMIN_TOKEN);

  // gunakan BASE utk path relatif
  const url = /^https?:\/\//i.test(path) ? path : `${BASE}${path}`;

  let body: BodyInit | undefined;
  if (opts.body !== undefined && opts.body !== null) {
    if (isJsonBody(opts.body)) {
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
      body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
    } else {
      body = opts.body as BodyInit;
    }
  }

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    credentials: 'include',
    body,
  });

  const ct = res.headers.get('content-type') ?? '';
  const payload: unknown = ct.includes('application/json')
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => '');

  if (!res.ok) {
    let msg = res.statusText;
    if (typeof payload === 'string' && payload.trim()) {
      msg = payload;
    } else if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;
      if (typeof obj.error === 'string') msg = obj.error;
      else if (typeof obj.message === 'string') msg = obj.message;
    }
    throw new ApiError(res.status, msg, payload);
  }

  return payload as T;
}

// Helpers
export const apiGet = <T = unknown>(p: string, h?: Record<string, string>) =>
  api<T>(p, { method: 'GET', headers: h });

export const apiPost = <T = unknown>(p: string, b?: Bodyish, h?: Record<string, string>) =>
  api<T>(p, { method: 'POST', body: b, headers: h });

export function createBooking(body: {
  trailId: string;
  slotId: string;
  partySize: number;
  isNonLocal?: boolean;
  note?: string;
  members: { fullName: string; idNumber: string; birthdate?: string; gender?: string; city?: string }[];
}) {
  return api<{ ok: true; data: { id: string; orderId: string } }>('/api/bookings', {
    method: 'POST',
    body,
  });
}
