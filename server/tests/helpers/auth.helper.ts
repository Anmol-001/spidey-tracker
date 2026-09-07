import bcrypt from 'bcryptjs';
import { User } from '../../src/modules/user/user.model.js';
import { generateAccessToken } from '../../src/shared/utils/jwt.util.js';
import { buildUserAttributes } from '../fixtures/user.fixture.js';

/**
 * Creates a persistent test user in the test database.
 */
export async function createTestUser(overrides: Record<string, unknown> = {}) {
  const attrs = buildUserAttributes(overrides);
  const passwordHash = await bcrypt.hash((attrs.password as string) || 'StrongPassword123!', 4);

  const user = new User({
    username: attrs.username,
    email: attrs.email,
    passwordHash,
    role: attrs.role || 'citizen',
    isActive: attrs.isActive !== undefined ? attrs.isActive : true,
  });

  await user.save();
  return user;
}

/**
 * Generates an Authorization Bearer header object for a user or user ID.
 */
export function getAuthHeaders(token: string): { Authorization: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Creates a test user and returns user model, signed JWT access token, and auth headers.
 */
export async function createAuthenticatedUser(
  role: 'citizen' | 'responder' | 'admin' = 'citizen',
  overrides: Record<string, unknown> = {},
) {
  const user = await createTestUser({ role, ...overrides });
  const token = generateAccessToken({
    sub: user._id.toString(),
    email: user.email,
  });

  return {
    user,
    token,
    headers: getAuthHeaders(token),
  };
}
