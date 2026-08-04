import { Request, Response, NextFunction } from 'express';
import { IHealthService, healthService as defaultHealthService } from './health.service.js';
import { successResponse } from '../../shared/utils/apiResponse.js';

export class HealthController {
  private service: IHealthService;

  constructor(service: IHealthService = defaultHealthService) {
    this.service = service;
  }

  /**
   * Handles GET /health
   * Returns: { success: true, message: "Server is healthy", data: { status: "ok" } }
   */
  public getHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.checkHealth();
      res.status(200).json(successResponse('Server is healthy', data));
    } catch (error) {
      next(error);
    }
  };
}

export const healthController = new HealthController();
