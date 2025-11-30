import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; 
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'test') {
  // 테스트 환경: 실제 DB 연결 없이 prisma stub 생성
  prisma = new PrismaClient() as any; // 타입 캐스팅으로 임시 stub
} else {
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 로드되지 않았습니다.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter: adapter
  });
}

export { prisma };
export default prisma;
