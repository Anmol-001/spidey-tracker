import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { UserRole } from '../../modules/user/user.types.js';

/**
 * Middleware factory for role-based access control.
 * Restricts access to routes based on authenticated user roles.
 *
 * @param allowedRoles - One or more user roles authorized to access the route
 * @returns Express middleware function
 */
export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, 'Forbidden: Insufficient permissions', 'FORBIDDEN');
    }

    next();
  };
