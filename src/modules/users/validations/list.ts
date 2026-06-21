import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const listUsersSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export default async (req: Request, _res: Response, next: NextFunction) => {
  const { success, error } = await listUsersSchema.safeParseAsync(req.query);
  if (!success) return next(error);
  return next();
};
