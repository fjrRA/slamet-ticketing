// src/server/libs/jwt.ts
import jwt, { type SignOptions } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;
export type JWTPayload = { uid: string; role: 'USER' | 'ADMIN' };

export function signJwt(p: JWTPayload, exp: SignOptions['expiresIn'] = '7d') {
  const opts: SignOptions = { expiresIn: exp };
  return jwt.sign(p, SECRET, opts);
}

export function verifyJwt(t: string) {
  return jwt.verify(t, SECRET) as JWTPayload;
}
