import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import errorHandler from '#shared/middlewares/errorHandler.ts';
import NotFoundError from '#shared/errors/NotFoundError.ts';

function fakeResponse() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
  };
  return res as unknown as Response;
}

test('errorHandler formata ZodError como 400 com issues', () => {
  const { error } = z.object({ name: z.string() }).safeParse({});
  const res = fakeResponse();

  errorHandler(error, {} as never, res, () => {});

  assert.equal((res as never as { statusCode: number }).statusCode, 400);
  assert.equal((res as never as { body: { message: string } }).body.message, 'Validation error');
});

test('errorHandler formata mongoose CastError como 400', () => {
  const error = new mongoose.Error.CastError('ObjectId', 'not-an-id', 'id');
  const res = fakeResponse();

  errorHandler(error, {} as never, res, () => {});

  assert.equal((res as never as { statusCode: number }).statusCode, 400);
});

test('errorHandler formata mongoose ValidationError como 400 com issues', () => {
  const error = new mongoose.Error.ValidationError();
  error.addError(
    'age',
    new mongoose.Error.ValidatorError({
      path: 'age',
      message: 'Path `age` (999) is more than maximum allowed value (120).',
    }),
  );
  const res = fakeResponse();

  errorHandler(error, {} as never, res, () => {});

  assert.equal((res as never as { statusCode: number }).statusCode, 400);
  const body = (res as never as { body: { message: string; issues: unknown[] } }).body;
  assert.equal(body.message, 'Validation error');
  assert.equal(body.issues.length, 1);
});

test('errorHandler usa o statusCode de um AppError', () => {
  const error = new NotFoundError('User not found');
  const res = fakeResponse();

  errorHandler(error, {} as never, res, () => {});

  assert.equal((res as never as { statusCode: number }).statusCode, 404);
  assert.equal((res as never as { body: { message: string } }).body.message, 'User not found');
});

test('errorHandler retorna 500 para erros não mapeados', () => {
  const res = fakeResponse();

  errorHandler(new Error('boom'), {} as never, res, () => {});

  assert.equal((res as never as { statusCode: number }).statusCode, 500);
  assert.equal(
    (res as never as { body: { message: string } }).body.message,
    'Internal server error',
  );
});
