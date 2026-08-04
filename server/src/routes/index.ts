import { Router } from 'express';
import { healthRouter } from '../modules/health/health.route.js';
import { authRouter } from '../modules/auth/auth.route.js';

const apiRouter: Router = Router();

// Mount Health Routes
apiRouter.use('/health', healthRouter);

// Mount Auth Routes
apiRouter.use('/auth', authRouter);

export { apiRouter };
