// src/server/middlewares/auth.ts
import type { RequestHandler } from 'express';
import { verifyJwt } from '@server/libs/jwt';

const COOKIE = process.env.COOKIE_NAME ?? 'sid';

export const requireUser: RequestHandler = (req, res, next) => {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return res.status(401).json({ error: 'Unauthenticated' });
  try {
    req.auth = verifyJwt(raw);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin: RequestHandler = (req, res, next) =>
  requireUser(req, res, () => {
    if (req.auth?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin only' });
    }
    next();
  });
