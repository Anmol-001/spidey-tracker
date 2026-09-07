import { describe, it, expect } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createAuthenticatedUser } from '../../helpers/auth.helper.js';

describe('GET /api/v1/auth/me', () => {
  it('should return lightweight identity probe for authenticated user (200 OK)', async () => {
    const { user, headers } = await createAuthenticatedUser('citizen');

    const res = await api.get('/api/v1/auth/me').set(headers).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Authenticated user retrieved successfully');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(user._id.toString());
    expect(res.body.data.username).toBe(user.username);
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.role).toBe('citizen');

    // Lightweight probe does not return timestamps or status
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.body.data.__v).toBeUndefined();
    expect(res.body.data.isActive).toBeUndefined();
  });

  it('should reject unauthenticated request with 401 Unauthorized', async () => {
    const res = await api.get('/api/v1/auth/me').expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should reject request with malformed Bearer token with 401', async () => {
    const res = await api
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer malformed.invalid.token')
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should reject request when user account is inactive (401 Unauthorized)', async () => {
    const { headers } = await createAuthenticatedUser('citizen', { isActive: false });

    const res = await api.get('/api/v1/auth/me').set(headers).expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
