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

  /**
   * Handles user login authentication
   *
   * @param req - Express Request containing validated login body
   * @param res - Express Response returning HTTP 200 OK with access token and user profile
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(successResponse('Login successful', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves the currently authenticated user identity from request context
   *
   * @param req - Express Request containing authenticated user identity
   * @param res - Express Response returning HTTP 200 OK with user profile
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).json(successResponse('Authenticated user retrieved successfully', req.user));
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
