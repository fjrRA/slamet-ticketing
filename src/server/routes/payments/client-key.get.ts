// src/server/routes/payments/client-key.get.ts
import type { RequestHandler } from 'express';

export const getClientKey: RequestHandler = (_req, res) => {
  res.json({ clientKey: process.env.MIDTRANS_CLIENT_KEY });
};
