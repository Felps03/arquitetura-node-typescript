import type { z } from 'zod';
import type { updateUserSchema } from '../validations/update.ts';

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
