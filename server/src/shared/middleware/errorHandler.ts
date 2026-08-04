import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';
import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../config/logger.js';
import { config } from '../config/config.js';

/**
 * Global Error Handling Middleware.
 * Intercepts all operational and unhandled exceptions, formatting them into standard ApiResponse JSON.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details;
  } else if (err instanceof Error) {
    message = config.isProduction ? 'Internal server error' : err.message;
    details = config.isProduction ? undefined : { stack: err.stack };
  }

  logger.error(`[${req.method}] ${req.originalUrl} - Error: ${message}`, {
    statusCode,
    code,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json(errorResponse(message, code, details));
};
