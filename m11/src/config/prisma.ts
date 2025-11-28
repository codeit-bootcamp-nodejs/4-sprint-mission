// Prisma Client를 불러와서 사용 준비
import { PrismaClient } from '@prisma/client';

// Prisma Client 인스턴스 생성
// - 개발 환경(NODE_ENV=development)에서는 쿼리까지 로깅
// - 운영 환경(NODE_ENV=production 등)에서는 경고/에러만 로깅
const prisma = new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

// 애플리케이션 종료 전에 DB 연결을 안전하게 해제하기 위한 처리
// - 'beforeExit' 이벤트는 Node.js 프로세스가 종료되기 직전에 실행됨
// - Prisma Client의 연결을 닫아 리소스 누수 방지
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

// Prisma Client 인스턴스를 앱 전체에서 재사용할 수 있도록 export
export default prisma;
