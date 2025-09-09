import { PrismaClient } from '@prisma/client';
declare global {
    var __prisma: PrismaClient | undefined;
}
/**
 * PrismaClient 싱글톤
 * - 프로덕션: top-level export
 * - 개발(TSX watch): 글로벌 캐시 사용
 */
export declare const prisma: PrismaClient;
//# sourceMappingURL=prismaClient.d.ts.map