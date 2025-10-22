// src/server/middlewares/error.ts
import type { Request, Response, NextFunction } from 'express';

function extractStatus(err: unknown): number {
  if (typeof err === 'object' && err !== null) {
    const s = (err as { status?: unknown }).status;
    if (typeof s === 'number') return s;
  }
  return 500;
}

function extractMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string' && m.length) return m;
  }
  return 'Internal Server Error';
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = extractStatus(err);
  const message = extractMessage(err);

  if (status >= 500) console.error(err);
  res.status(status).json({ ok: false, message });
}
