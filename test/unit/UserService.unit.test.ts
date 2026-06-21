import { test } from 'node:test';
import assert from 'node:assert/strict';
import UserService from '#modules/users/services/UserService.ts';
import UserRepository from '#modules/users/repositories/UserRepository.ts';

const fakeUser = { _id: '665f1c2e5a0f4c2a1f000000', name: 'Felipe Santos', age: 32, __v: 0 };

test('UserService.create mapeia o documento criado para UserResponse', async (t) => {
  const createMock = t.mock.method(UserRepository, 'create', async () => fakeUser);

  const result = await UserService.create({ name: 'Felipe Santos', age: 32 });

  assert.deepEqual(result, fakeUser);
  assert.equal(createMock.mock.callCount(), 1);
});

test('UserService.list mapeia a página de documentos para UserResponse', async (t) => {
  t.mock.method(UserRepository, 'findPaginated', async () => ({ data: [fakeUser], total: 1 }));

  const result = await UserService.list(1, 10);

  assert.deepEqual(result, { data: [fakeUser], page: 1, limit: 10, total: 1 });
});

test('UserService.getById lança NotFoundError quando o repository não encontra o usuário', async (t) => {
  t.mock.method(UserRepository, 'findById', async () => null);

  await assert.rejects(
    () => UserService.getById('000000000000000000000000'),
    (error: Error) => {
      assert.equal(error.name, 'NotFoundError');
      return true;
    },
  );
});

test('UserService.update lança NotFoundError quando o repository não encontra o usuário', async (t) => {
  t.mock.method(UserRepository, 'updateById', async () => null);

  await assert.rejects(() => UserService.update('000000000000000000000000', { age: 40 }));
});

test('UserService.remove lança NotFoundError quando o repository não encontra o usuário', async (t) => {
  t.mock.method(UserRepository, 'deleteById', async () => null);

  await assert.rejects(() => UserService.remove('000000000000000000000000'));
});

test('UserService.remove resolve sem erro quando o usuário existe', async (t) => {
  t.mock.method(UserRepository, 'deleteById', async () => fakeUser);

  await assert.doesNotReject(() => UserService.remove(fakeUser._id));
});
