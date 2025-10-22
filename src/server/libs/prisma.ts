// src/server/libs/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // optional: log: ["query","error","warn"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const prisma = db;
