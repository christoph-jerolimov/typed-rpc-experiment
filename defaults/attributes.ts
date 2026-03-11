import type { Attributes } from "../types/attributes.js";
import type { Method } from "../types/method.js";

export const defaultAttributes: Record<Method, Attributes> = {
  GET: {
    destructive: false,
    readOnly: true,
    idempotent: true,
  },
  HEAD: {
    destructive: false,
    readOnly: true,
    idempotent: true,
  },
  POST: {
    destructive: false,
    readOnly: false,
    idempotent: false,
  },
  PUT: {
    destructive: false,
    readOnly: false,
    idempotent: true,
  },
  PATCH: {
    destructive: true,
    readOnly: false,
    idempotent: false,
  },
  DELETE: {
    destructive: true,
    readOnly: false,
    idempotent: false,
  },
};
