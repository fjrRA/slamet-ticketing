// src/server/routes/payments/index.ts
import { Router } from 'express';
import { MOCK } from './constants';
import { getClientKey } from './client-key.get';
import { postSnapToken } from './snap-token.post';
import { postNotify } from './notify.post';
import { postMockSuccess } from './mock-success.post';
import { postMockExpire } from './mock-expire.post';
import { requireUser } from '@server/middlewares/auth';

const r = Router();

/** Final endpoints (setelah di-mount di /api/payments): */
r.get('/client-key', getClientKey);                  // -> GET /api/payments/client-key
r.post('/snap-token', requireUser, postSnapToken);   // -> POST /api/payments/snap-token

if (MOCK) {
  r.post('/mock/success', postMockSuccess);          // -> POST /api/payments/mock/success
  r.post('/mock/expire', postMockExpire);            // -> POST /api/payments/mock/expire
}

/** Webhook Midtrans (isi di dashboard): */
r.post('/notify', postNotify);                       // -> POST /api/payments/notify

export default r;
