import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';

export const idParamSchema = z.object({
  id: z.string().refine(mongoose.isValidObjectId, 'Invalid user id'),
});

export default async (req: Request, _res: Response, next: NextFunction) => {
  const { success, error } = await idParamSchema.safeParseAsync(req.params);
  if (!success) return next(error);
  return next();
};
