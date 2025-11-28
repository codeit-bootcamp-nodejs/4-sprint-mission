# 패키지 설치 및 빌드
npm install
npx prisma generate
npm run build

# PM2 실행 명령어
pm2 start ecosystem.config.js --env production