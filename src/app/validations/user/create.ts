import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export default async (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    name: z.string(),
    age: z.number().optional()
  });

  const { success, error } = await schema.safeParseAsync(req.body);
  if (!success) return res.status(400).json(error);
  return next();
};
