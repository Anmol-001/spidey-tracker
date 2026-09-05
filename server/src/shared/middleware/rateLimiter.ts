import { rateLimit } from 'express-rate-limit';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication Rate Limiter
 * Applied specifically to brute-force-sensitive endpoints (/auth/login, /auth/register).
 * Limits each IP to 10 requests per minute.
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // Max 10 requests per window
  standardHeaders: 'draft-7', // Return standard RateLimit headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
  message: 'Too many authentication attempts. Please try again after a minute.',
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json(errorResponse(options.message, 'TOO_MANY_REQUESTS'));
  },
});

/**
 * General API Rate Limiter
 * Applied globally to /api/v1/* routes.
 * Limits each IP to 100 requests per 15 minutes, skipping operational health probes.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests per window
  standardHeaders: 'draft-7', // Return standard RateLimit headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
  skip: (req) => req.path === '/health' || req.path.startsWith('/health'),
  message: 'Too many requests from this IP. Please try again later.',
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json(errorResponse(options.message, 'TOO_MANY_REQUESTS'));
  },
});
