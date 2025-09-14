import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtTokenPayload } from '../types';

const prisma = new PrismaClient();

// 비밀번호 해싱
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// 비밀번호 검증
export const comparePassword = async (
  password: string, 
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Access Token 생성
export const generateAccessToken = (userId: number): string => {
  const payload: Omit<JwtTokenPayload, 'iat' | 'exp'> = { 
    userId, 
    type: 'access' 
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// Refresh Token 생성
export const generateRefreshToken = (userId: number): string => {
  const payload: Omit<JwtTokenPayload, 'iat' | 'exp'> = { 
    userId, 
    type: 'refresh' 
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Access Token 검증
export const verifyAccessToken = (token: string): JwtTokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtTokenPayload;
  } catch (error) {
    return null;
  }
};

// Refresh Token 검증
export const verifyRefreshToken = (token: string): JwtTokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtTokenPayload;
  } catch (error) {
    return null;
  }
};

// Refresh Token을 DB에 저장
export const saveRefreshToken = async (
  userId: number, 
  token: string
): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료
  
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });
};

// Refresh Token 삭제 (로그아웃)
export const deleteRefreshToken = async (token: string): Promise<void> => {
  try {
    await prisma.refreshToken.delete({
      where: { token }
    });
  } catch (error) {
    // 토큰이 이미 없는 경우 무시
    console.log('Token not found or already deleted');
  }
};

// 만료된 Refresh Token 정리
export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  });
};