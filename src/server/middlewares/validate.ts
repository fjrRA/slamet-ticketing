// src/server/middlewares/validate.ts
import { z } from 'zod';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction
} from 'express';
import type { ZodSchema } from 'zod';

export const validate =
  <S extends ZodSchema>(schema: S) =>
    (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
      const parsed = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!parsed.success) {
        return next({ status: 422, message: parsed.error.message });
      }

      // Simpan hasil validasi (cast aman untuk TS)
      (req as ExpressRequest & { validated?: z.infer<S> }).validated = parsed.data as z.infer<S>;
      next();
    };
