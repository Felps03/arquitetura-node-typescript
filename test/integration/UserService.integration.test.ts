import { test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import NotFoundError from '#shared/errors/NotFoundError.ts';
import UserService from '#modules/users/services/UserService.ts';
import UserSchema from '#modules/users/schemas/UserSchema.ts';

before(async () => {
  await mongoose.connect(
    process.env.MONGO_DB_URL || 'mongodb://localhost:27017/arquitetura-node-typescript-test',
  );
});

beforeEach(async () => {
  await UserSchema.deleteMany({});
});

after(async () => {
  await UserSchema.deleteMany({});
  await mongoose.disconnect();
});

test('Dado um payload válido, quando UserService.create é chamado, então o usuário é persistido no MongoDB', async () => {
  // Given
  const payload = { name: 'Felipe Santos', age: 32 };

  // When
  const created = await UserService.create(payload);

  // Then
  assert.equal(created.name, payload.name);
  assert.equal(created.age, payload.age);
  const persisted = await UserSchema.findById(created._id);
  assert.ok(persisted);
  assert.equal(persisted?.name, payload.name);
});

test('Dado um payload com age fora do intervalo permitido, quando UserService.create é chamado, então rejeita com erro de validação do Mongoose', async () => {
  // Given
  const payload = { name: 'Felipe Santos', age: 999 };

  // When / Then
  await assert.rejects(
    () => UserService.create(payload),
    (error: Error) => {
      assert.ok(error instanceof mongoose.Error.ValidationError);
      return true;
    },
  );
});

test('Dado um usuário existente, quando UserService.getById é chamado com o id correto, então retorna o usuário', async () => {
  // Given
  const created = await UserService.create({ name: 'Maria Souza', age: 28 });

  // When
  const found = await UserService.getById(created._id);

  // Then
  assert.deepEqual(found, created);
});

test('Dado que não existe usuário com o id informado, quando UserService.getById é chamado, então lança NotFoundError', async () => {
  // Given
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  // When / Then
  await assert.rejects(() => UserService.getById(nonExistentId), NotFoundError);
});

test('Dado um usuário existente, quando UserService.update é chamado com payload parcial, então persiste a alteração', async () => {
  // Given
  const created = await UserService.create({ name: 'Felipe Santos', age: 32 });

  // When
  const updated = await UserService.update(created._id, { age: 33 });

  // Then
  assert.equal(updated.age, 33);
  assert.equal(updated.name, created.name);
  const persisted = await UserSchema.findById(created._id);
  assert.equal(persisted?.age, 33);
});

test('Dado que não existe usuário com o id informado, quando UserService.update é chamado, então lança NotFoundError', async () => {
  // Given
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  // When / Then
  await assert.rejects(() => UserService.update(nonExistentId, { age: 40 }), NotFoundError);
});

test('Dado um usuário existente, quando UserService.remove é chamado, então o usuário deixa de existir no banco', async () => {
  // Given
  const created = await UserService.create({ name: 'Felipe Santos', age: 32 });

  // When
  await UserService.remove(created._id);

  // Then
  const persisted = await UserSchema.findById(created._id);
  assert.equal(persisted, null);
  await assert.rejects(() => UserService.getById(created._id), NotFoundError);
});

test('Dado que não existe usuário com o id informado, quando UserService.remove é chamado, então lança NotFoundError', async () => {
  // Given
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  // When / Then
  await assert.rejects(() => UserService.remove(nonExistentId), NotFoundError);
});

test('Dado múltiplos usuários criados, quando UserService.list é chamado com paginação, então retorna a página correta ordenada pelos mais recentes', async () => {
  // Given
  const first = await UserService.create({ name: 'Usuário 1', age: 20 });
  const second = await UserService.create({ name: 'Usuário 2', age: 21 });
  const third = await UserService.create({ name: 'Usuário 3', age: 22 });

  // When
  const firstPage = await UserService.list(1, 2);
  const secondPage = await UserService.list(2, 2);

  // Then
  assert.equal(firstPage.total, 3);
  assert.equal(firstPage.data.length, 2);
  assert.deepEqual(
    firstPage.data.map((user) => user._id),
    [third._id, second._id],
  );

  assert.equal(secondPage.data.length, 1);
  assert.deepEqual(secondPage.data[0]._id, first._id);
});
