import * as z from 'zod';
import * as yaml from 'yaml';

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
    query: UserFilter,
    output: z => z.array(User),
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

const apis = {
  getUsers,
  getUserById,
};

console.log('All APIs:');
for (const definition of Object.values(apis)) {
  console.log('-', definition.method, definition.path);
}

console.log();
console.log('===================== OpenAPI');
console.log();

// This is far away from a complete version!! WIP!!
const openAPI = {
  openapi: '3.0.0',
  info: {},
  paths: {} as Record<string, Record<string, Record<string, any>>>,
};

Object.values(apis).forEach((definition: Definition<InputSchema, OutputSchema>) => {
  if (!openAPI.paths[definition.path]) {
    openAPI.paths[definition.path] = {};
  }
  if (!openAPI.paths[definition.path]![definition.method]) {
    openAPI.paths[definition.path]![definition.method] = {};
  }

  const output = typeof definition.schema.output === 'function' ? definition.schema.output(z) : definition.schema.output;

  openAPI.paths[definition.path]![definition.method]! = {
    summary: definition.title,
    description: definition.description,
    responses: {
      200: {
        content: {
          'application/json': {
            schema: output?.toJSONSchema(),
          },
        },
      },
    },
  };
});
console.log(openAPI);
console.log(yaml.stringify(openAPI));

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
