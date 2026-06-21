import AppError from '#shared/errors/AppError.ts';

export default class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: unknown) {
    super(message, 404, details);
  }
}
