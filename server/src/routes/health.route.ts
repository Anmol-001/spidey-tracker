import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router: Router = Router();

/**
 * @route GET /health
 * @desc Telemetry health check endpoint
 * @access Public
 */
router.get('/', healthController.getHealth);

export const healthRouter = router;
