import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

/**
 * 404 Not Found Catch-All Middleware.
 * Converts unmatched routes into an ApiError.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
