import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.util.js';
import { User } from '../../modules/user/user.model.js';

/**
 * Authentication middleware that verifies JWT Bearer tokens and attaches
 * authenticated user identity to req.user.
 */
export const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const [, token] = authHeader.split(' ');

    if (!token || token.trim() === '') {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const payload = verifyAccessToken(token);

    if (!payload?.sub) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const user = await User.findById(payload.sub)
      .select('_id username email role isActive createdAt updatedAt')
      .lean()
      .exec();

    if (!user || user.isActive !== true) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.toISOString()
          : new Date(user.createdAt).toISOString(),
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt.toISOString()
          : new Date(user.updatedAt).toISOString(),
    };

    next();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      next(error);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Unauthorized', 'UNAUTHORIZED'));
      return;
    }
    next(error);
  }
};
