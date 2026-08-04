import { z } from 'zod';
import { USER_ROLES } from './user.types.js';

/**
 * Username validation regex: alphanumeric, underscores, hyphens (character set only)
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Password complexity regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Zod schema for creating a new user record
 */
export const createUserSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      USERNAME_REGEX,
      'Username can only contain alphanumeric characters, underscores, and hyphens',
    ),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  role: z
    .enum([USER_ROLES.CITIZEN, USER_ROLES.RESPONDER, USER_ROLES.ADMIN])
    .default(USER_ROLES.CITIZEN),
});

/**
 * Zod schema for updating user details
 */
export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      USERNAME_REGEX,
      'Username can only contain alphanumeric characters, underscores, and hyphens',
    )
    .optional(),
  email: z.string().trim().toLowerCase().email('Invalid email address format').optional(),
  role: z.enum([USER_ROLES.CITIZEN, USER_ROLES.RESPONDER, USER_ROLES.ADMIN]).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Zod schema for route param ID validation (MongoDB ObjectId)
 */
export const userIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
