import { describe, it, expect } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { buildRegisterPayload } from '../../fixtures/user.fixture.js';

describe('POST /api/v1/auth/register', () => {
  it('should successfully register a new user and return 201 with sanitized profile', async () => {
    const payload = buildRegisterPayload();

    const res = await api.post('/api/v1/auth/register').send(payload).expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.username).toBe(payload.username);
    expect(res.body.data.email).toBe(payload.email.toLowerCase());
    expect(res.body.data.createdAt).toBeDefined();
    expect(res.body.data.updatedAt).toBeDefined();

    // Sensitive fields must never be exposed
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.__v).toBeUndefined();
  });

  it('should reject registration when email is already in use (409 Conflict)', async () => {
    const payload1 = buildRegisterPayload({ email: 'duplicate@dailybugle.test' });
    await api.post('/api/v1/auth/register').send(payload1).expect(201);

    const payload2 = buildRegisterPayload({ email: 'duplicate@dailybugle.test' });
    const res = await api.post('/api/v1/auth/register').send(payload2).expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should reject registration when username is already in use (409 Conflict)', async () => {
    const payload1 = buildRegisterPayload({ username: 'SpiderGwen' });
    await api.post('/api/v1/auth/register').send(payload1).expect(201);

    const payload2 = buildRegisterPayload({ username: 'SpiderGwen' });
    const res = await api.post('/api/v1/auth/register').send(payload2).expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('should reject registration with invalid email format (400 Bad Request)', async () => {
    const payload = buildRegisterPayload({ email: 'not-an-email' });

    const res = await api.post('/api/v1/auth/register').send(payload).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('should reject registration with short password (400 Bad Request)', async () => {
    const payload = buildRegisterPayload({ password: 'short' });

    const res = await api.post('/api/v1/auth/register').send(payload).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });
});
