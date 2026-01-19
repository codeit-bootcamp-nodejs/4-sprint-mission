import jwt from 'jsonwebtoken';

import AppError from './appError.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants.js';

type AccessPayload = jwt.JwtPayload & { sub: number; type: 'access' };
type RefreshPayload = jwt.JwtPayload & { sub: number; type: 'refresh' };

export function generateTokens(userId: number) {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' } as AccessPayload,
    ACCESS_TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' } as RefreshPayload,
    REFRESH_TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): { userId: number } {
  try {
    const d = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256'],
    }) as AccessPayload;
    if (
      typeof d !== 'object' ||
      d.type !== 'access' ||
      typeof d.sub !== 'number'
    ) {
      throw new AppError('유효하지 않은 액세스 토큰', 401);
    }
    return { userId: d.sub };
  } catch {
    throw new AppError('유효하지 않은 액세스 토큰', 401);
  }
}

export function verifyRefreshToken(token: string): { userId: number } {
  try {
    const d = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      algorithms: ['HS256'],
    }) as RefreshPayload;
    if (
      typeof d !== 'object' ||
      d.type !== 'refresh' ||
      typeof d.sub !== 'number'
    ) {
      throw new AppError('유효하지 않은 리프레시 토큰', 401);
    }
    return { userId: d.sub };
  } catch {
    throw new AppError('유효하지 않은 리프레시 토큰', 401);
  }
}
