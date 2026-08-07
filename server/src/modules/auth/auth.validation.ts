import { z } from 'zod';

/**
 * Username regex: alphanumeric, underscores, hyphens (character set only)
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Password complexity regex: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validation schema for user registration request body
 */
export const registerSchema = z.object({
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
      PASSWORD_COMPLEXITY_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
});

/**
 * Validation schema for user login request body
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, 'Password is required'),
});
