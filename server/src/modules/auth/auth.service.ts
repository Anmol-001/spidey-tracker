import bcrypt from 'bcryptjs';
import { User } from '../user/user.model.js';
import { ApiError } from '../../shared/utils/apiError.js';
import type { RegisterInput, RegisteredUser } from './auth.types.js';

/**
 * Number of salt rounds for bcrypt password hashing
 */
const SALT_ROUNDS = 12;

/**
 * Authentication Service handling domain business logic for auth operations
 */
export class AuthService {
  /**
   * Registers a new user account in the system
   *
   * @param input - Registration payload containing username, email, and plain password
   * @returns Explicitly constructed registered user data
   */
  public async register(input: RegisterInput): Promise<RegisteredUser> {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim();

    // 1. Check duplicate email
    const existingEmail = await User.findOne({ email }).select('_id').lean().exec();

    if (existingEmail) {
      throw new ApiError(409, 'An account with this email already exists.', 'CONFLICT');
    }

    // 2. Check duplicate username
    const existingUsername = await User.findOne({ username }).select('_id').lean().exec();

    if (existingUsername) {
      throw new ApiError(409, 'This username is already taken.', 'CONFLICT');
    }

    // 3. Hash password with bcryptjs (12 salt rounds)
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    // 4. Persist user with race condition error handling
    try {
      const user = new User({
        username,
        email,
        passwordHash: hashedPassword,
      });

      await user.save();

      // 5. Return explicitly constructed response
      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        const mongoError = error as {
          keyPattern?: Record<string, number>;
          keyValue?: Record<string, unknown>;
          message?: string;
        };

        // Priority 1: Structured index pattern (keyPattern)
        if (mongoError.keyPattern) {
          if (mongoError.keyPattern.email) {
            throw new ApiError(409, 'An account with this email already exists.', 'CONFLICT');
          }
          if (mongoError.keyPattern.username) {
            throw new ApiError(409, 'This username is already taken.', 'CONFLICT');
          }
        }

        // Priority 2: Structured duplicate key values (keyValue)
        if (mongoError.keyValue) {
          if ('email' in mongoError.keyValue) {
            throw new ApiError(409, 'An account with this email already exists.', 'CONFLICT');
          }
          if ('username' in mongoError.keyValue) {
            throw new ApiError(409, 'This username is already taken.', 'CONFLICT');
          }
        }

        // Priority 3: Fallback string inspection of error message
        if (typeof mongoError.message === 'string') {
          if (mongoError.message.includes('email')) {
            throw new ApiError(409, 'An account with this email already exists.', 'CONFLICT');
          }
          if (mongoError.message.includes('username')) {
            throw new ApiError(409, 'This username is already taken.', 'CONFLICT');
          }
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('An unexpected error occurred during user registration.');
    }
  }
}

export const authService = new AuthService();
