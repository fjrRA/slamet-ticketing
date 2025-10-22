// src/server/middlewares/admin/admin-auth.ts
import type { Request, Response, NextFunction } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const expected = (process.env.ADMIN_TOKEN ?? "").trim();
  if (!expected) return res.status(500).json({ error: "ADMIN_TOKEN not set" });

  const token = (req.header("x-admin-token") ?? "").trim();
  if (token !== expected) return res.status(401).json({ error: "Unauthorized" });

  next();
}
