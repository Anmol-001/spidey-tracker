import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';

interface RequestValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Safe accessor for validated query parameters from response locals.
 */
export function getValidatedQuery<T>(res: Response): T {
  return res.locals['validatedQuery'] as T;
}

/**
 * Safe accessor for validated body payload from response locals.
 */
export function getValidatedBody<T>(res: Response): T {
  return res.locals['validatedBody'] as T;
}

/**
 * Safe accessor for validated route parameters from response locals.
 */
export function getValidatedParams<T>(res: Response): T {
  return res.locals['validatedParams'] as T;
}

/**
 * Reusable middleware factory for validating incoming request body, query, or path parameters against Zod schemas.
 */
export function validateRequest(schemas: RequestValidationSchemas) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        const parsedBody = await schemas.body.parseAsync(req.body);
        req.body = parsedBody;
        res.locals['validatedBody'] = parsedBody;
      }
      if (schemas.query) {
        const parsedQuery = await schemas.query.parseAsync(req.query);
        req.query = parsedQuery as unknown as Request['query'];
        res.locals['validatedQuery'] = parsedQuery;
      }
      if (schemas.params) {
        const parsedParams = await schemas.params.parseAsync(req.params);
        req.params = parsedParams as unknown as Request['params'];
        res.locals['validatedParams'] = parsedParams;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        next(ApiError.badRequest('Validation failed', issues));
        return;
      }
      next(error);
    }
  };
}
