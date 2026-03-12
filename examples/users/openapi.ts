import * as z from 'zod';
import * as yaml from 'yaml';

import type { Definition, InputSchema, OutputSchema } from '../../types/definition.js';

import { api } from './api.js';

const definitions = api as Record<string, Definition<InputSchema, OutputSchema>>;

console.log('All APIs:');
for (const definition of Object.values(definitions)) {
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

Object.values(definitions).forEach((definition: Definition<InputSchema, OutputSchema>) => {
  const method = definition.method.toLocaleLowerCase('en');
  // Convert /users/:id to /users/${id}
  const path = definition.path.replaceAll(/:([A-Za-z0-9-]+)/g, '{$1}');

  if (!openAPI.paths[path]) {
    openAPI.paths[path] = {};
  }
  if (!openAPI.paths[path]![method]) {
    openAPI.paths[path]![method] = {};
  }

  const parameters: any[] = [];

  // TODO: add definition.path to parameters
  if (definition.path === '/users/:id') {
    parameters.push({
      name: 'id',
      in: 'path',
      // ...
      // schema: 
    });
  }

  if (definition.schema.query) {
    // Iterate over all query parameters
    parameters.push({
      name: 'id',
      in: 'query',
      // ...
      // schema: 
    });
  }

  const output = typeof definition.schema.output === 'function' ? definition.schema.output(z) : definition.schema.output;

  openAPI.paths[path]![method]! = {
    summary: definition.title,
    description: definition.description,
    tags: definition.tags,
    parameters: parameters,
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
