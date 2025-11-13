// src/lib/prismaClient.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // 글로벌 캐시용
  var __prisma: PrismaClient | undefined;
}

/**
 * PrismaClient 싱글톤
 * - 프로덕션: top-level export
 * - 개발(TSX watch): 글로벌 캐시 사용
 */
export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient();
  // {log: ['query', 'warn', 'error'],}

// 개발 환경에서 글로벌 캐시에 저장
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;
