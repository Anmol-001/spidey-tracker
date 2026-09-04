import { Request, Response, NextFunction } from 'express';
import { incidentService } from './incident.service.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import { IncidentQueryInput } from './incident.validation.js';

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

  /**
   * Handles incident listing request with pagination and filtering
   *
   * @param req - Express Request containing validated query parameters
   * @param res - Express Response returning HTTP 200 OK with paginated incidents
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public getIncidents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await incidentService.getIncidents(req.query as unknown as IncidentQueryInput);
      res.status(200).json(successResponse('Incidents retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles incident retrieval by unique ID
   *
   * @param req - Express Request containing validated ID path parameter
   * @param res - Express Response returning HTTP 200 OK with incident response DTO
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public getIncidentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const incident = await incidentService.getIncidentById(req.params['id'] as string);
      res.status(200).json(successResponse('Incident retrieved successfully', incident));
    } catch (error) {
      next(error);
    }
  };
}

export const incidentController = new IncidentController();
