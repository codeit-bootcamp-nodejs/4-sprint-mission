import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; 
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (!DATABASE_URL) {
  // DATABASE_URL이 없으면 기본 PrismaClient 사용 (유닛 테스트에서 모킹될 예정)
  prisma = new PrismaClient();
} else {
  // DATABASE_URL이 있으면 실제 DB 연결 (통합 테스트 및 프로덕션)
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter: adapter
  });
}

export { prisma };
export default prisma;
