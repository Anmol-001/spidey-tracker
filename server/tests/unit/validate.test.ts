import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  validateRequest,
  getValidatedBody,
  getValidatedQuery,
  getValidatedParams,
} from '../../src/shared/middleware/validate.js';
import { ApiError } from '../../src/shared/utils/apiError.js';
import type { Request, Response } from 'express';

describe('Validation Middleware (validate.ts)', () => {
  const testBodySchema = z
    .object({
      name: z.string().min(2),
      age: z.number().int().positive(),
    })
    .strict();

  const testQuerySchema = z
    .object({
      search: z.string().optional(),
    })
    .strict();

  it('should validate valid body payload and attach to res.locals', async () => {
    const middleware = validateRequest({ body: testBodySchema });

    const req = {
      body: { name: 'Peter Parker', age: 25 },
    } as Request;

    const res = {
      locals: {},
    } as unknown as Response;

    let nextCalled = false;
    let nextError: unknown = null;

    await middleware(req, res, (err?: unknown) => {
      nextCalled = true;
      nextError = err;
    });

    expect(nextCalled).toBe(true);
    expect(nextError).toBeUndefined();

    const validated = getValidatedBody<{ name: string; age: number }>(res);
    expect(validated).toEqual({ name: 'Peter Parker', age: 25 });
  });

  it('should reject invalid body and pass ApiError to next', async () => {
    const middleware = validateRequest({ body: testBodySchema });

    const req = {
      body: { name: 'P', age: -5 }, // Name too short, age negative
    } as Request;

    const res = {
      locals: {},
    } as unknown as Response;

    let nextError: any = null;

    await middleware(req, res, (err?: unknown) => {
      nextError = err;
    });

    expect(nextError).toBeInstanceOf(ApiError);
    expect(nextError.statusCode).toBe(400);
    expect(nextError.code).toBe('BAD_REQUEST');
    expect(Array.isArray(nextError.details)).toBe(true);
    expect(nextError.details.length).toBeGreaterThan(0);
  });

  it('should reject unknown fields when schema is strict', async () => {
    const middleware = validateRequest({ body: testBodySchema });

    const req = {
      body: { name: 'Peter Parker', age: 25, extraHackerField: 'injected' },
    } as Request;

    const res = {
      locals: {},
    } as unknown as Response;

    let nextError: any = null;

    await middleware(req, res, (err?: unknown) => {
      nextError = err;
    });

    expect(nextError).toBeInstanceOf(ApiError);
    expect(nextError.statusCode).toBe(400);
  });

  it('should validate query parameters and store in res.locals', async () => {
    const middleware = validateRequest({ query: testQuerySchema });

    const req = {
      query: { search: 'spider' },
    } as unknown as Request;

    const res = {
      locals: {},
    } as unknown as Response;

    let nextCalled = false;

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    const query = getValidatedQuery<{ search?: string }>(res);
    expect(query.search).toBe('spider');
  });
});
