import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../shared/middleware/validate.js';
import { registerSchema } from './auth.validation.js';

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

export const authRouter = router;
