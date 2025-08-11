import { execSync } from 'child_process';

try {
  console.log('Prisma Client 생성중...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma Client가 성공적으로 생성되었습니다.');

  console.log('서버 시작중...');
  import('./sprintMission3/app.js');
} catch (error) {
  console.error('서버 시작 실패:', error);
  process.exit(1);
}
