import { PrismaClient } from '@prisma/client';
// 🛑 주의: PostgreSQL을 사용하려면 @prisma/adapter-pg 패키지가 설치되어 있어야 합니다.
// npm install @prisma/adapter-pg pg
import { PrismaPg } from '@prisma/adapter-pg'; 
import { Pool } from 'pg'; 

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL 환경 변수가 로드되지 않았습니다.");
  process.exit(1); 
}

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  // 런타임 접속 URL을 Adapter 인스턴스를 통해 명시적으로 전달합니다.
  adapter: adapter
}); 

export { prisma }; 
export default prisma;
