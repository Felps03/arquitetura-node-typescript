import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import AppError from '#shared/errors/AppError.ts';
import logger from '#shared/logger/index.ts';

export default function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      issues: error.issues,
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid value for field "${error.path}"` });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: 'Validation error',
      issues: Object.values(error.errors).map((err) => ({
        path: [err.path],
        message: err.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message, details: error.details });
    return;
  }

  logger.error('Unhandled error', {
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  res.status(500).json({ message: 'Internal server error' });
}
