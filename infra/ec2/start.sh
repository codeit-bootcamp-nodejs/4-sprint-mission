// PM2 전역 설치
npm install pm2 -g

// 앱 실행
pm2 start dist/app.js

// 이름 지정 실행
pm2 start dist/app.js --name panda

// 중지
pm2 stop panda

// 재실행
pm2 restart panda

// 삭제
pm2 kill

// 목록 확인
pm2 list

// 로그 확인
pm2 logs panda

// 백그라운드에서 실행되게
pm2 start panda

// 서버 재부팅 시에도 자동 실행
pm2 startup