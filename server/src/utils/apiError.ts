/**
 * Operational Error Class for HTTP exceptions with status code and error code categorization.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code = 'OPERATIONAL_ERROR',
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  public static unauthorized(message = 'Unauthorized access'): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  public static forbidden(message = 'Forbidden access'): ApiError {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  public static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  public static internal(message = 'Internal server error', details?: unknown): ApiError {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR', details, false);
  }
}
