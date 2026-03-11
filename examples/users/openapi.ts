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
