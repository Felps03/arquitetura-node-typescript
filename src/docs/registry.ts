import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createUserSchema } from '#modules/users/validations/create.ts';
import { updateUserSchema } from '#modules/users/validations/update.ts';
import { listUsersSchema } from '#modules/users/validations/list.ts';
import { idParamSchema } from '#modules/users/validations/idParam.ts';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const userResponseSchema = registry.register(
  'UserResponse',
  z.object({
    _id: z.string().openapi({ example: '665f1c2e5a0f4c2a1f000000' }),
    name: z.string().openapi({ example: 'Felipe Santos' }),
    age: z.number().openapi({ example: 32 }),
    __v: z.number().openapi({ example: 0 }),
  }),
);

const paginatedUserResponseSchema = registry.register(
  'PaginatedUserResponse',
  z.object({
    data: z.array(userResponseSchema),
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 10 }),
    total: z.number().openapi({ example: 1 }),
  }),
);

const errorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({ message: z.string().openapi({ example: 'User not found' }) }),
);

registry.registerPath({
  method: 'post',
  path: '/user',
  tags: ['User'],
  summary: 'Cria um usuário',
  request: {
    body: { content: { 'application/json': { schema: createUserSchema } } },
  },
  responses: {
    201: {
      description: 'Usuário criado com sucesso',
      content: { 'application/json': { schema: userResponseSchema } },
    },
    400: {
      description: 'Erro de validação',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/user',
  tags: ['User'],
  summary: 'Lista usuários de forma paginada',
  request: { query: listUsersSchema },
  responses: {
    200: {
      description: 'Lista paginada de usuários',
      content: { 'application/json': { schema: paginatedUserResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/user/{id}',
  tags: ['User'],
  summary: 'Busca um usuário pelo id',
  request: { params: idParamSchema },
  responses: {
    200: {
      description: 'Usuário encontrado',
      content: { 'application/json': { schema: userResponseSchema } },
    },
    404: {
      description: 'Usuário não encontrado',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/user/{id}',
  tags: ['User'],
  summary: 'Atualiza parcialmente um usuário',
  request: {
    params: idParamSchema,
    body: { content: { 'application/json': { schema: updateUserSchema } } },
  },
  responses: {
    200: {
      description: 'Usuário atualizado',
      content: { 'application/json': { schema: userResponseSchema } },
    },
    404: {
      description: 'Usuário não encontrado',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/user/{id}',
  tags: ['User'],
  summary: 'Remove um usuário',
  request: { params: idParamSchema },
  responses: {
    204: { description: 'Usuário removido' },
    404: {
      description: 'Usuário não encontrado',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
});

export default registry;
