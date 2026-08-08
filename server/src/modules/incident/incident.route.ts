import { Router } from 'express';
import { incidentController } from './incident.controller.js';
import { authenticateUser } from '../../shared/middleware/auth.middleware.js';
import { validateRequest } from '../../shared/middleware/validate.js';
import { createIncidentSchema } from './incident.validation.js';

const router: Router = Router();

/**
 * @route POST /api/v1/incidents
 * @desc Report a new incident
 * @access Protected (All authenticated users)
 */
router.post(
  '/',
  authenticateUser,
  validateRequest({
    body: createIncidentSchema,
  }),
  incidentController.createIncident,
);

export const incidentRouter = router;
