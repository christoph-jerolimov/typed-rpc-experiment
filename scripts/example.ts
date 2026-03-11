import * as z from 'zod';
import type { PathParams } from '../types/path.js';
import type { Definition, InputSchema, OutputSchema } from '../types/definition.js';

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
    query: z => UserFilter,
    input: z => z.string(),
    output: z => z.array(User),
  },
} as const satisfies Definition<InputSchema, OutputSchema>;

const getUserById = {
  method: 'GET',
  path: '/users/:id',
  title: 'Get one user by id',
  schema: {
    input: z => z.string(),
    output: z => User,
  },
} as const satisfies Definition<InputSchema, OutputSchema>;

// { id: string }
type GetUserByIdPathParams = PathParams<typeof getUserById.path>
// TODO test type

const apis = {
  getUsers,
  getUserById,
};

// TODO client usage
// wrap apis with discovery.getBaseUrl()

// useQuery({ query: apis.getUsers({
//   query: { offset: 0, limit: 10 },
// }) })

// useQuery({ query: apis.getUserById({
//   path: { id: '4711' },
// }) })

// TODO server usage
// wrap apis and implement the backend
// all input variables (path, query and body) should automatically use saveParse

// router.implement(apis, {
//   getUsers: async ({ query: { offset, limit } }) => {
//     console.log(`get all users at offset ${offset} with limit ${limit}`);
//   },
//   getUserById: async ({ path: { id } }) => {
//     console.log(`get user by id ${id}`);
//   },
// });
