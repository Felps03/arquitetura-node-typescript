import type { Request, Response, NextFunction } from 'express';
import { createUserSchema } from './create.ts';

export const updateUserSchema = createUserSchema.partial();

export default async (req: Request, _res: Response, next: NextFunction) => {
  const { success, error } = await updateUserSchema.safeParseAsync(req.body);
  if (!success) return next(error);
  return next();
};
