import type { Request, Response, NextFunction } from 'express';
import logger from '#shared/logger/index.ts';

export default function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  res.on('finish', () => {
    logger.info('request completed', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}
