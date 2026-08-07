import { Router } from 'express';
import { healthRouter } from '../modules/health/health.route.js';
import { authRouter } from '../modules/auth/auth.route.js';
import { userRouter } from '../modules/user/user.route.js';

const apiRouter: Router = Router();

// Mount Health Routes
apiRouter.use('/health', healthRouter);

// Mount Auth Routes
apiRouter.use('/auth', authRouter);

// Mount User Routes
apiRouter.use('/users', userRouter);

export { apiRouter };
