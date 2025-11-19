import jwt from 'jsonwebtoken';
import { env } from '../../src/shared/config/env';

export function generateAuthToken(userId: number): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
