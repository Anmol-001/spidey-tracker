import type { RegisterInput } from '../../src/modules/auth/auth.types.js';

let counter = 1;

/**
 * Generates fresh user registration payload with unique email/username.
 */
export function buildRegisterPayload(overrides: Partial<RegisterInput> = {}): RegisterInput {
  const id = counter++;
  return {
    username: `testuser_${id}`,
    email: `user_${id}@dailybugle.test`,
    password: 'StrongPassword123!',
    ...overrides,
  };
}

/**
 * Generates user attributes for database creation fixtures.
 */
export function buildUserAttributes(overrides: Record<string, unknown> = {}) {
  const id = counter++;
  return {
    username: `hero_${id}`,
    email: `hero_${id}@spidey.test`,
    password: 'StrongPassword123!',
    role: 'citizen',
    isActive: true,
    ...overrides,
  };
}
