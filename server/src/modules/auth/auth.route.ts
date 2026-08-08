import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../shared/middleware/validate.js';
import { authenticateUser } from '../../shared/middleware/auth.middleware.js';
import { authorizeRoles } from '../../shared/middleware/role.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const router: Router = Router();

/**
 * @route POST /register
 * @desc Register a new user account
 * @access Public
 */
router.post(
  '/register',
  validateRequest({
    body: registerSchema,
  }),
  authController.register,
);

/**
 * @route POST /login
 * @desc Authenticate user and issue access token
 * @access Public
 */
router.post(
  '/login',
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

/**
 * @route GET /admin-test
 * @desc Temporary test endpoint to verify admin authorization
 * @access Protected (Admin only)
 */
router.get('/admin-test', authenticateUser, authorizeRoles('admin'), authController.adminTest);

export const authRouter = router;
