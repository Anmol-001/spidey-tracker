import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../shared/utils/apiError.js';
import { successResponse } from '../../shared/utils/apiResponse.js';

/**
 * User Controller handling HTTP transport for user profile endpoints
 */
export class UserController {
  /**
   * Retrieves the profile of the currently authenticated user
   *
   * @param req - Express Request containing authenticated user identity in req.user
   * @param res - Express Response returning HTTP 200 OK with sanitized user profile
   * @param next - Express NextFunction for forwarding unhandled errors
   */
  public getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }

      res.status(200).json(successResponse('User profile retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
