import { describe, it, expect } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createAuthenticatedUser } from '../../helpers/auth.helper.js';
import { authorizeRoles } from '../../../src/shared/middleware/role.middleware.js';
import { ApiError } from '../../../src/shared/utils/apiError.js';
import type { Request, Response } from 'express';

describe('Security Hardening & Protection Policies', () => {
  describe('Authentication Rate Limiting (10 req/min)', () => {
    it('should throttle repeated login attempts beyond 10 requests and return 429 TOO_MANY_REQUESTS', async () => {
      let got429 = false;
      let lastResponse: any = null;

      for (let i = 0; i < 14; i++) {
        const res = await api
          .post('/api/v1/auth/login')
          .send({ email: 'ratelimit@spidey.test', password: 'Password123!' });

        if (res.status === 429) {
          got429 = true;
          lastResponse = res;
          break;
        }
      }

      expect(got429).toBe(true);
      expect(lastResponse.body.success).toBe(false);
      expect(lastResponse.body.error.code).toBe('TOO_MANY_REQUESTS');
      expect(lastResponse.body.message).toContain('Too many authentication attempts');
    });
  });

  describe('Operational Health Check Bypass', () => {
    it('should allow GET /health without being throttled by rate limiters (200 OK)', async () => {
      const res = await api.get('/health').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
    });
  });

  describe('Payload Body Size Restriction (1MB Max)', () => {
    it('should reject JSON payloads exceeding 1MB with 413 PAYLOAD_TOO_LARGE', async () => {
      const { headers } = await createAuthenticatedUser('citizen');
      const largeString = 'x'.repeat(1.2 * 1024 * 1024); // 1.2 MB string

      const res = await api
        .post('/api/v1/incidents')
        .set(headers)
        .send({ largeData: largeString })
        .expect(413);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
      expect(res.body.message).toContain('Request entity too large');
    });
  });

  describe('Role-Based Access Control (RBAC)', () => {
    it('should allow access when user role matches allowed roles', () => {
      const middleware = authorizeRoles('admin', 'responder');
      const req = {
        user: { id: '1', username: 'hero', email: 'hero@test.com', role: 'responder' },
      } as unknown as Request;
      const res = {} as Response;
      let called = false;

      middleware(req, res, () => {
        called = true;
      });

      expect(called).toBe(true);
    });

    it('should reject with 403 Forbidden when user role is not authorized', () => {
      const middleware = authorizeRoles('admin');
      const req = {
        user: { id: '1', username: 'citizen1', email: 'c@test.com', role: 'citizen' },
      } as unknown as Request;
      const res = {} as Response;

      expect(() => {
        middleware(req, res, () => {});
      }).toThrow(ApiError);

      try {
        middleware(req, res, () => {});
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(403);
        expect((err as ApiError).code).toBe('FORBIDDEN');
      }
    });

    it('should reject with 401 Unauthorized when request is unauthenticated', () => {
      const middleware = authorizeRoles('admin');
      const req = {} as Request;
      const res = {} as Response;

      try {
        middleware(req, res, () => {});
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(401);
        expect((err as ApiError).code).toBe('UNAUTHORIZED');
      }
    });
  });
});
