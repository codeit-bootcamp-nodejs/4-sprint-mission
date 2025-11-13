import jwt, { type JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants.js';
import AppError from './appError.js';

function generateTokens(userId: number) {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return {
    accessToken,
    refreshToken,
  };
}

function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (typeof decoded === 'string') {
    throw new AppError('유효하지 않은 토큰 형식입니다.');
  }
  return { userId: decoded.id };
}

function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  if (typeof decoded === 'string') {
    throw new AppError('유효하지 않은 토큰 형식입니다.');
  }
  return { userId: decoded.id };
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
