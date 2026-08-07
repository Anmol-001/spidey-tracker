import { Router } from 'express';
import { userController } from './user.controller.js';
import { authenticateUser } from '../../shared/middleware/auth.middleware.js';

const router: Router = Router();

/**
 * @route GET /me
 * @desc Get the profile of the currently authenticated user
 * @access Protected
 */
router.get('/me', authenticateUser, userController.getCurrentUser);

export const userRouter = router;
