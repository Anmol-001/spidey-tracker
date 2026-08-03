import { ApiResponse } from '../types/index.js';

/**
 * Utility helper to build standardized success API responses.
 *
 * @param message Human-readable status message
 * @param data Optional response payload
 * @returns Standard ApiResponse structure
 */
export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
}

/**
 * Utility helper to build standardized error API responses.
 *
 * @param message Human-readable error message
 * @param code Error classification code
 * @param details Optional additional debug or validation details
 * @returns Standard ApiResponse structure
 */
export function errorResponse(
  message: string,
  code = 'INTERNAL_ERROR',
  details?: unknown,
): ApiResponse<never> {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };
}
