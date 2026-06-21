import type { z } from 'zod';
import type { createUserSchema } from '../validations/create.ts';

export type CreateUserRequest = z.infer<typeof createUserSchema>;
