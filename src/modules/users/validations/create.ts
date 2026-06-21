import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  age: z.number().optional(),
});

export default async (req: Request, _res: Response, next: NextFunction) => {
  const { success, error } = await createUserSchema.safeParseAsync(req.body);
  if (!success) return next(error);
  return next();
};
