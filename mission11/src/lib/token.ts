 import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from './constants';

function generateTokens(userId: number) {
  const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.sub };
}

function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { userId: decoded.sub };
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
