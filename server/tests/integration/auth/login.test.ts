import { describe, it, expect } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createTestUser } from '../../helpers/auth.helper.js';

describe('POST /api/v1/auth/login', () => {
  it('should successfully authenticate active user and return access token', async () => {
    const email = 'peter.parker@spidey.test';
    const password = 'CorrectPassword123!';
    await createTestUser({ email, password, isActive: true });

    const res = await api.post('/api/v1/auth/login').send({ email, password }).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data.accessToken).toBeDefined();
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.passwordHash).toBeUndefined();

    // Verify returned token works on protected endpoint
    const protectedRes = await api
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${res.body.data.accessToken}`)
      .expect(200);

    expect(protectedRes.body.success).toBe(true);
    expect(protectedRes.body.data.email).toBe(email);
  });

  it('should reject login with wrong password (401 Unauthorized)', async () => {
    const email = 'miles.morales@spidey.test';
    await createTestUser({ email, password: 'CorrectPassword123!', isActive: true });

    const res = await api
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPassword456!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.message).toBe('Invalid email or password.');
  });

  it('should reject login for non-existent email (401 Unauthorized)', async () => {
    const res = await api
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@spidey.test', password: 'AnyPassword123!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.message).toBe('Invalid email or password.');
  });

  it('should reject login for inactive accounts (401 Unauthorized)', async () => {
    const email = 'norman.osborn@spidey.test';
    const password = 'GoblinPassword123!';
    await createTestUser({ email, password, isActive: false });

    const res = await api.post('/api/v1/auth/login').send({ email, password }).expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.message).toBe('Invalid email or password.');
  });
});
