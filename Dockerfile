# 1. Base Image 선택 (LTS 버전 권장)
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 의존성 설치를 위해 package.json 복사
COPY package*.json ./

# 4. 의존성 설치 (ci 명령어를 사용하여 lock 파일 기준 설치)
RUN npm ci

# 5. 소스 코드 복사
COPY . .

# 6. Prisma 클라이언트 생성 (DB 연결 준비)
RUN npx prisma generate

# 7. TypeScript 빌드
RUN npm run build

# 8. 포트 노출
EXPOSE 3000

# 9. 서버 실행 (dist/main.js 실행)
CMD ["npm", "run", "start"]