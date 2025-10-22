// src/server/types/express.d.ts
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: { uid: string; role: 'USER' | 'ADMIN' };
  }
}
