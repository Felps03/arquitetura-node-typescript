import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import App from '../../src/app.ts';
import UserSchema from '#modules/users/schemas/UserSchema.ts';

let server: Server;
let baseUrl: string;

before(
  () =>
    new Promise<void>((resolve) => {
      const app = new App().init();
      server = app.listen(0, () => {
        const { port } = server.address() as { port: number };
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    }),
);

after(() => new Promise<void>((resolve) => server.close(() => resolve())));

test('GET /health retorna 200', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.deepEqual(body, { status: 'ok' });
});

test('GET /docs/openapi.json retorna a especificação OpenAPI', async () => {
  const response = await fetch(`${baseUrl}/docs/openapi.json`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.openapi, '3.1.0');
  assert.ok(body.paths['/user']);
  assert.ok(body.paths['/user/{id}']);
});

test('POST /user retorna 400 quando o payload é inválido', async () => {
  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 32 }),
  });

  assert.equal(response.status, 400);

  const body = await response.json();
  assert.equal(body.message, 'Validation error');
  assert.ok(Array.isArray(body.issues));
});

test('POST /user retorna 400 quando o age tem tipo inválido', async () => {
  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Felipe Santos', age: 'trinta e dois' }),
  });

  assert.equal(response.status, 400);

  const body = await response.json();
  assert.equal(body.message, 'Validation error');
  assert.ok(Array.isArray(body.issues));
});

test('POST /user retorna 400 quando o corpo está vazio', async () => {
  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);

  const body = await response.json();
  assert.equal(body.message, 'Validation error');
  assert.ok(Array.isArray(body.issues));
});

test('POST /user retorna 201 e cria o usuário quando o payload é válido', async (t) => {
  const created = {
    _id: '665f1c2e5a0f4c2a1f000000',
    name: 'Felipe Santos',
    age: 32,
    __v: 0,
  };
  const createMock = t.mock.method(UserSchema, 'create', async () => created);

  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Felipe Santos', age: 32 }),
  });

  assert.equal(response.status, 201);

  const body = await response.json();
  assert.deepEqual(body, created);
  assert.equal(createMock.mock.callCount(), 1);
});

test('POST /user aceita o payload sem o campo opcional age', async (t) => {
  const created = {
    _id: '665f1c2e5a0f4c2a1f000001',
    name: 'Maria Souza',
    __v: 0,
  };
  t.mock.method(UserSchema, 'create', async () => created);

  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Maria Souza' }),
  });

  assert.equal(response.status, 201);

  const body = await response.json();
  assert.deepEqual(body, created);
});

test('POST /user retorna 500 quando a persistência falha', async (t) => {
  t.mock.method(UserSchema, 'create', async () => {
    throw new Error('connection refused');
  });

  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Felipe Santos', age: 32 }),
  });

  assert.equal(response.status, 500);
});

test('respostas incluem o cabeçalho CORS liberado para qualquer origem', async () => {
  const response = await fetch(`${baseUrl}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 32 }),
  });

  assert.equal(response.headers.get('access-control-allow-origin'), '*');
});

test('rotas não cadastradas retornam 404', async () => {
  const response = await fetch(`${baseUrl}/rota-inexistente`);

  assert.equal(response.status, 404);
});

test('GET /user retorna 200 com a lista paginada de usuários', async (t) => {
  const fakeUser = { _id: '665f1c2e5a0f4c2a1f000000', name: 'Felipe Santos', age: 32, __v: 0 };
  t.mock.method(UserSchema, 'find', () => ({
    sort: () => ({ skip: () => ({ limit: () => Promise.resolve([fakeUser]) }) }),
  }));
  t.mock.method(UserSchema, 'countDocuments', async () => 1);

  const response = await fetch(`${baseUrl}/user?page=1&limit=10`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.deepEqual(body, { data: [fakeUser], page: 1, limit: 10, total: 1 });
});

test('GET /user retorna 400 quando a paginação é inválida', async () => {
  const response = await fetch(`${baseUrl}/user?limit=200`);

  assert.equal(response.status, 400);
});

test('GET /user/:id retorna 200 quando o usuário existe', async (t) => {
  const fakeUser = { _id: '665f1c2e5a0f4c2a1f000000', name: 'Felipe Santos', age: 32, __v: 0 };
  t.mock.method(UserSchema, 'findById', async () => fakeUser);

  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.deepEqual(body, fakeUser);
});

test('GET /user/:id retorna 404 quando o usuário não existe', async (t) => {
  t.mock.method(UserSchema, 'findById', async () => null);

  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`);

  assert.equal(response.status, 404);

  const body = await response.json();
  assert.equal(body.message, 'User 665f1c2e5a0f4c2a1f000000 not found');
});

test('GET /user/:id retorna 400 quando o id não tem formato de ObjectId', async () => {
  const response = await fetch(`${baseUrl}/user/not-an-id`);

  assert.equal(response.status, 400);
});

test('PATCH /user/:id retorna 200 e o usuário atualizado', async (t) => {
  const updated = { _id: '665f1c2e5a0f4c2a1f000000', name: 'Felipe Santos', age: 33, __v: 0 };
  t.mock.method(UserSchema, 'findByIdAndUpdate', async () => updated);

  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 33 }),
  });

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.deepEqual(body, updated);
});

test('PATCH /user/:id retorna 404 quando o usuário não existe', async (t) => {
  t.mock.method(UserSchema, 'findByIdAndUpdate', async () => null);

  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 33 }),
  });

  assert.equal(response.status, 404);
});

test('PATCH /user/:id retorna 400 quando o payload é inválido', async () => {
  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 'trinta e três' }),
  });

  assert.equal(response.status, 400);
});

test('DELETE /user/:id retorna 204 quando o usuário existe', async (t) => {
  const fakeUser = { _id: '665f1c2e5a0f4c2a1f000000', name: 'Felipe Santos', age: 32, __v: 0 };
  t.mock.method(UserSchema, 'findByIdAndDelete', async () => fakeUser);

  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`, {
    method: 'DELETE',
  });

  assert.equal(response.status, 204);
});

test('DELETE /user/:id retorna 404 quando o usuário não existe', async (t) => {
  t.mock.method(UserSchema, 'findByIdAndDelete', async () => null);

  const response = await fetch(`${baseUrl}/user/665f1c2e5a0f4c2a1f000000`, {
    method: 'DELETE',
  });

  assert.equal(response.status, 404);
});
