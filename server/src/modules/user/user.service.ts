import { User } from './user.model.js';
import { ApiError } from '../../shared/utils/apiError.js';
import type { UserResponseDto } from './user.types.js';

/**
 * User Service handling domain business logic for user profile operations
 */
export class UserService {
  /**
   * Retrieves the sanitized profile of a user by ID
   *
   * @param userId - Unique identifier of the user
   * @returns Sanitized UserResponseDto
   */
  public async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await User.findById(userId)
      .select('_id username email role isActive createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export const userService = new UserService();
