import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUserSchema } from '#modules/users/validations/create.ts';
import { updateUserSchema } from '#modules/users/validations/update.ts';
import { listUsersSchema } from '#modules/users/validations/list.ts';
import { idParamSchema } from '#modules/users/validations/idParam.ts';

test('createUserSchema exige name e aceita age opcional', () => {
  assert.equal(createUserSchema.safeParse({ name: 'Felipe' }).success, true);
  assert.equal(createUserSchema.safeParse({ name: 'Felipe', age: 32 }).success, true);
  assert.equal(createUserSchema.safeParse({ age: 32 }).success, false);
  assert.equal(createUserSchema.safeParse({ name: 'Felipe', age: 'trinta' }).success, false);
});

test('updateUserSchema aceita payload parcial ou vazio', () => {
  assert.equal(updateUserSchema.safeParse({}).success, true);
  assert.equal(updateUserSchema.safeParse({ age: 40 }).success, true);
  assert.equal(updateUserSchema.safeParse({ age: 'quarenta' }).success, false);
});

test('listUsersSchema aplica defaults e rejeita valores inválidos', () => {
  const { success, data } = listUsersSchema.safeParse({});
  assert.equal(success, true);
  assert.deepEqual(data, { page: 1, limit: 10 });

  assert.equal(listUsersSchema.safeParse({ page: '2', limit: '5' }).success, true);
  assert.equal(listUsersSchema.safeParse({ limit: '200' }).success, false);
  assert.equal(listUsersSchema.safeParse({ page: '-1' }).success, false);
});

test('idParamSchema valida o formato de ObjectId do MongoDB', () => {
  assert.equal(idParamSchema.safeParse({ id: '665f1c2e5a0f4c2a1f000000' }).success, true);
  assert.equal(idParamSchema.safeParse({ id: 'not-an-id' }).success, false);
});
