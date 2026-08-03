import { Router } from 'express';
import { healthRouter } from './health.route.js';

const apiRouter: Router = Router();

// Mount Health Routes
apiRouter.use('/health', healthRouter);

export { apiRouter };
