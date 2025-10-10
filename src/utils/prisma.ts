import { PrismaClient } from '@prisma/client';

// Prisma 클라이언트 싱글톤 인스턴스
const prisma = new PrismaClient();

// Prisma 클라이언트 연결 종료 처리
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;