import { describe, it, expect, vi } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createAuthenticatedUser } from '../../helpers/auth.helper.js';
import { User } from '../../../src/modules/user/user.model.js';

describe('GET /api/v1/users/me (Canonical User Profile)', () => {
  it('should return full sanitized profile with isActive and timestamps (200 OK)', async () => {
    const { user, headers } = await createAuthenticatedUser('citizen');

    const res = await api.get('/api/v1/users/me').set(headers).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User profile retrieved successfully');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(user._id.toString());
    expect(res.body.data.username).toBe(user.username);
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.role).toBe('citizen');
    expect(res.body.data.isActive).toBe(true);
    expect(res.body.data.createdAt).toBeDefined();
    expect(res.body.data.updatedAt).toBeDefined();

    // Data sanitization assertions
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.__v).toBeUndefined();
  });

  it('should execute exactly one database lookup during profile retrieval', async () => {
    const { headers } = await createAuthenticatedUser('citizen');

    const findByIdSpy = vi.spyOn(User, 'findById');

    await api.get('/api/v1/users/me').set(headers).expect(200);

    // Exactly 1 lookup performed in authenticateUser, 0 in userController.getCurrentUser
    expect(findByIdSpy).toHaveBeenCalledTimes(1);

    findByIdSpy.mockRestore();
  });

  it('should reject unauthenticated request with 401 Unauthorized', async () => {
    const res = await api.get('/api/v1/users/me').expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should reject requests with token belonging to an inactive user (401 Unauthorized)', async () => {
    const { headers } = await createAuthenticatedUser('citizen', { isActive: false });

    const res = await api.get('/api/v1/users/me').set(headers).expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
