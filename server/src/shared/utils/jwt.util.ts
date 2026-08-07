import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Access token payload containing minimal subject identity
 */
export type AccessTokenPayload = {
  sub: string;
  email: string;
};

/**
 * Generates a signed JWT access token with HS256 algorithm and configured expiration
 *
 * @param payload - Minimal token payload containing sub and email
 * @returns Signed JWT access token string
 */
export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, config.jwtAccessSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtAccessExpiresIn as jwt.SignOptions['expiresIn'] & string,
  });
};

/**
 * Verifies a JWT access token using the configured secret and HS256 algorithm
 *
 * @param token - JWT access token string to verify
 * @returns Decoded access token payload
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, config.jwtAccessSecret, {
    algorithms: ['HS256'],
  });

  return decoded as AccessTokenPayload;
};
