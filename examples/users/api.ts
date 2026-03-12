import * as z from 'zod';

import type { PathParams } from '../../types/path.js';
import type { Definition, InputSchema, OutputSchema } from '../../types/definition.js';

const User = z.object({
  name: z.string(),
});

const UserFilter = z.object({ 
  name: z.string(),
  offset: z.number(),
  limit: z.number(),
  // etc.
});

const getUsers = {
  method: 'GET',
  path: '/users',
  title: 'Get all users',
  schema: {
    query: UserFilter,
    output: z.array(User),
  },
} as const satisfies Definition<InputSchema, OutputSchema>;

const getUserById = {
  method: 'GET',
  path: '/users/:id',
  title: 'Get one user by id',
  schema: {
    output: User,
  },
} as const satisfies Definition<InputSchema, OutputSchema>;

// { id: string }
type GetUserByIdPathParams = PathParams<typeof getUserById.path>
// TODO test type

export const api = {
  getUsers,
  getUserById,
} as any;
