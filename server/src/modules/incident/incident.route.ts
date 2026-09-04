import { Router } from 'express';
import { incidentController } from './incident.controller.js';
import { authenticateUser } from '../../shared/middleware/auth.middleware.js';
import { validateRequest } from '../../shared/middleware/validate.js';
import {
  createIncidentSchema,
  incidentIdParamSchema,
  incidentQuerySchema,
} from './incident.validation.js';

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

/**
 * @route GET /api/v1/incidents
 * @desc List, filter, and paginate incidents (newest first)
 * @access Protected (All authenticated users)
 */
router.get(
  '/',
  authenticateUser,
  validateRequest({
    query: incidentQuerySchema,
  }),
  incidentController.getIncidents,
);

/**
 * @route GET /api/v1/incidents/:id
 * @desc Retrieve incident details by unique ID
 * @access Protected (All authenticated users)
 */
router.get(
  '/:id',
  authenticateUser,
  validateRequest({
    params: incidentIdParamSchema,
  }),
  incidentController.getIncidentById,
);

export const incidentRouter = router;
