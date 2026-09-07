import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateAccessToken, verifyAccessToken } from '../../src/shared/utils/jwt.util.js';
import { config } from '../../src/shared/config/config.js';

describe('JWT Utility (jwt.util.ts)', () => {
  const samplePayload = {
    sub: '66b1a2c3d4e5f6a7b8c9d0e1',
    email: 'peter.parker@dailybugle.test',
  };

  it('should successfully sign a valid payload into a non-empty JWT string', () => {
    const token = generateAccessToken(samplePayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('should successfully decode and verify a validly signed token', () => {
    const token = generateAccessToken(samplePayload);
    const decoded = verifyAccessToken(token);

    expect(decoded.sub).toBe(samplePayload.sub);
    expect(decoded.email).toBe(samplePayload.email);
  });

  it('should reject a tampered token signature', () => {
    const token = generateAccessToken(samplePayload);
    const parts = token.split('.');
    // Modify signature part
    const tamperedToken = `${parts[0]}.${parts[1]}.tamperedSignature123`;

    expect(() => verifyAccessToken(tamperedToken)).toThrow();
  });

  it('should reject an expired token', () => {
    // Manually sign a token that expired 1 second ago
    const expiredToken = jwt.sign(samplePayload, config.jwtAccessSecret, {
      algorithm: 'HS256',
      expiresIn: '-1s',
    });

    expect(() => verifyAccessToken(expiredToken)).toThrow();
  });

  it('should reject an arbitrary invalid token string', () => {
    expect(() => verifyAccessToken('not-a-valid-jwt-token')).toThrow();
  });
});
