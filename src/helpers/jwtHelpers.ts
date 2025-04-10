// src/helpers/jwtHelpers.ts
import jwt, { SignOptions, VerifyOptions, JwtPayload, Secret } from 'jsonwebtoken';
import ms from 'ms';
import config from '../config/index.js'; // Use .js

/**
 * Creates a JWT token.
 * @param payload - The payload to include in the token (e.g., { id: userId }).
 * @param secret - The secret key to sign the token.
 * @param expiresIn - The expiration time (e.g., '1h', '7d').
 * @returns The generated JWT token.
 */
export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string
): string => {
   // Convert expiresIn string (like '1h') to seconds for jwt.sign
   const msFn = ms as unknown as (value: string) => number; // Type assertion for ms
   const expiresInSeconds = Math.floor(msFn(expiresIn) / 1000);

  const signOptions: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign(payload, secret, signOptions);
};

/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @param secret - The secret key used to sign the token.
 * @returns The decoded payload if the token is valid.
 * @throws {JsonWebTokenError | TokenExpiredError} If the token is invalid or expired.
 */
export const verifyToken = (
  token: string,
  secret: Secret
): JwtPayload => {
  // jwt.verify throws an error if verification fails (invalid signature, expired)
  // No need for try-catch here, let the caller handle potential errors
  return jwt.verify(token, secret) as JwtPayload;
};

// Convenience functions using secrets from config
export const createAccessToken = (payload: Record<string, unknown>): string => {
    return createToken(payload, config.jwt.secret, config.jwt.expires_in);
};

export const createRefreshToken = (payload: Record<string, unknown>): string => {
    return createToken(payload, config.jwt.refresh_secret, config.jwt.refresh_expires_in);
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return verifyToken(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return verifyToken(token, config.jwt.refresh_secret);
};
