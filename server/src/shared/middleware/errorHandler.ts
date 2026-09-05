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
  } else if (
    typeof err === 'object' &&
    err !== null &&
    (('status' in err && (err as { status?: number }).status === 413) ||
      ('statusCode' in err && (err as { statusCode?: number }).statusCode === 413) ||
      ('type' in err && (err as { type?: string }).type === 'entity.too.large'))
  ) {
    statusCode = 413;
    message = 'Request entity too large. Maximum size is 1MB.';
    code = 'PAYLOAD_TOO_LARGE';
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
