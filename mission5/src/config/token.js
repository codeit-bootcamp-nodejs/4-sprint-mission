import jwt from 'jsonwebtoken';

import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';

/**
 * Access + Refresh Token 생성
 * @param {number} userId
 */
export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
  return { accessToken, refreshToken };
}

/**
 * Access Token 검증
 * @param {string} token
 * @returns {Object} { userId }
 * @throws JWT 에러
 */
export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.userId };
}

/**
 * Refresh Token 검증
 * @param {string} token
 * @returns {Object} { userId }
 * @throws JWT 에러
 */
export function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { userId: decoded.userId };
}
