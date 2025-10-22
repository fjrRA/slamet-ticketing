// src/server/routes/health.ts
import { Router } from 'express';
import { midtransEnabled } from '@server/libs/midtrans';

const r = Router();

r.get('/', (_req, res) => {
  const paymentsMock = (process.env.PAYMENTS_MOCK ?? '').trim() === '1';
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    midtransEnabled,
    paymentsMock,
  });
});

export default r;
