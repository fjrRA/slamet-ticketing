// src/server/middlewares/admin/admin-gate.ts
import type { Request, Response, NextFunction } from "express";
import { adminAuth } from "./admin-auth";

function requireAdmin(_req: Request, res: Response) {
  return res.status(401).json({ error: "Unauthenticated (admin)" });
}

export function adminGate(req: Request, res: Response, next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";
  const hasDevToken = !!(process.env.ADMIN_TOKEN ?? "").trim();

  if (!isProd && hasDevToken) {
    return adminAuth(req, res, next);
  }

  return requireAdmin(req, res);
}

export default adminGate;