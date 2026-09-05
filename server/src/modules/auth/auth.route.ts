import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../shared/middleware/validate.js';
import { authenticateUser } from '../../shared/middleware/auth.middleware.js';
import { authRateLimiter } from '../../shared/middleware/rateLimiter.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const router: Router = Router();

/**
 * @route POST /register
 * @desc Register a new user account
 * @access Public (Rate limited)
 */
router.post(
  '/register',
  authRateLimiter,
  validateRequest({
    body: registerSchema,
  }),
  authController.register,
);

/**
 * @route POST /login
 * @desc Authenticate user and issue access token
 * @access Public (Rate limited)
 */
router.post(
  '/login',
  authRateLimiter,
  validateRequest({
    body: loginSchema,
  }),
  authController.login,
);

/**
 * @route GET /me
 * @desc Get currently authenticated user identity
 * @access Protected
 */
router.get('/me', authenticateUser, authController.getCurrentUser);

export const authRouter = router;
