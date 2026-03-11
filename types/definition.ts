import { z, ZodType } from 'zod';

import type { Method } from './method.js';
import type { Path } from './path.js';
import type { Attributes } from './attributes.js';

export type InputSchema = ZodType; // AnyZodObject in Zod 3
export type OutputSchema = ZodType; // AnyZodObject in Zod 3

export interface Definition<
  TInputSchema extends InputSchema,
  TOutputSchema extends OutputSchema,
> {
  method: Method;
  path: Path;
  // aligned with backstage actions...
  attributes?: Partial<Attributes>;
  // For OpenAPI export
  title?: string;
  description?: string;
  schema: {
    query?: (zod: typeof z) => InputSchema;
    input: (zod: typeof z) => InputSchema;
    output: (zod: typeof z) => OutputSchema;
    error?: (zod: typeof z) => OutputSchema;
  };
}
