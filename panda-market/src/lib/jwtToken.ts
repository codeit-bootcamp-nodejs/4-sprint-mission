import jwt, { type JwtPayload } from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from './constants.js';

function generateToken(userId: number) {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '24h',
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
}
function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as JwtPayload;
}
export { generateToken, verifyAccessToken, verifyRefreshToken };
