// src/server/routes/auth.ts
import { z } from 'zod';
import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '@server/libs/prisma';
import { Prisma } from '@prisma/client';
import { signJwt, verifyJwt } from '@server/libs/jwt';
import { requireUser } from '@server/middlewares/auth';

const r = Router();
const COOKIE = process.env.COOKIE_NAME ?? 'sid';
const isProd = process.env.NODE_ENV === 'production';

const rawDomain = (process.env.COOKIE_DOMAIN ?? '').trim();
const domain = rawDomain && rawDomain !== 'localhost' ? rawDomain : undefined;

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProd,
  ...(domain ? { domain } : {}),
};

function isPrismaUniqueError(e: unknown): e is Prisma.PrismaClientKnownRequestError {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';
}

// REGISTER
r.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body ?? {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Invalid body' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, phone, password: hash } });
  const token = signJwt({ uid: user.id, role: user.role });

  res.cookie(COOKIE, token, cookieBase);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// LOGIN
r.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Invalid body' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signJwt({ uid: user.id, role: user.role });
  res.cookie(COOKIE, token, cookieBase);
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// GET /me -> { ok, user }
// ===== /api/auth/me =====
r.get('/me', async (req, res) => {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return res.json(null);
  try {
    const { uid } = verifyJwt(raw);
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, name: true, email: true, phone: true, role: true }, // ← tambahkan phone
    });
    return res.json(user ?? null);
  } catch {
    return res.json(null);
  }
});

// ===== logout (terima GET dan POST) =====
const doLogout = (_req: Request, res: Response) => {
  res.clearCookie(COOKIE, cookieBase);
  res.json({ ok: true });
};
r.post('/logout', doLogout);
r.get('/logout', doLogout);

// ===== PATCH /api/auth/me (update profil) =====
const patchProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).max(20).optional().or(z.literal('').transform(() => undefined)),
});

r.patch('/me', requireUser, async (req, res, next) => {
  try {
    const body = patchProfileSchema.parse(req.body);

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email.toLowerCase();
    if (body.phone !== undefined) data.phone = body.phone ?? null;

    const user = await prisma.user.update({
      where: { id: req.auth!.uid },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    res.json({ ok: true, user });
  } catch (e: unknown) {
    if (isPrismaUniqueError(e)) {
      return res.status(409).json({ ok: false, message: 'Email sudah digunakan' });
    }
    next(e);
  }
});

// ===== PATCH /api/auth/password (ganti password) =====
const changePassSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

r.patch('/password', requireUser, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = changePassSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.auth!.uid },
      select: { id: true, password: true },
    });
    if (!user) return res.status(401).json({ ok: false, message: 'Unauthorized' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ ok: false, message: 'Password lama salah' });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default r;
