import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

export function generateAccessToken(userId: number): string {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): { userId: number } {
  return jwt.verify(token, ACCESS_SECRET) as { userId: number };
}

export function verifyRefreshToken(token: string): { userId: number } {
  return jwt.verify(token, REFRESH_SECRET) as { userId: number };
}
