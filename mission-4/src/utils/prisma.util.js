import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    
    // 에러 메시지 변환
    errorFormat: 'pretty',
});