import { Request, Response, NextFunction } from 'express';
import { incidentService } from './incident.service.js';
import { successResponse } from '../../shared/utils/apiResponse.js';

/**
 * Incident Controller handling HTTP transport for incident endpoints
 */
export class IncidentController {
  /**
   * Handles incident creation request
   *
   * @param req - Express Request containing validated body and authenticated user identity
   * @param res - Express Response returning HTTP 201 Created with incident response DTO
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public createIncident = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const incident = await incidentService.createIncident(req.body, req.user!.id);
      res.status(201).json(successResponse('Incident reported successfully', incident));
    } catch (error) {
      next(error);
    }
  };
}

export const incidentController = new IncidentController();
