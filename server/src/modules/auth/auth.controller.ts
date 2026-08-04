import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { successResponse } from '../../shared/utils/apiResponse.js';

/**
 * Authentication Controller handling HTTP transport for authentication endpoints
 */
export class AuthController {
  /**
   * Handles user registration
   *
   * @param req - Express Request containing validated registration body
   * @param res - Express Response returning HTTP 201 Created with registered user data
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(successResponse('User registered successfully', user));
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
