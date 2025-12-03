# Stage 1: Builder (의존성 설치 및 코드 빌드)
FROM node:20-alpine AS builder

WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# TypeScript 코드 빌드
RUN npm run build

# Stage 2: Runner (빌드된 애플리케이션 실행)
FROM node:20-alpine

WORKDIR /app

# 프로덕션 의존성 설치를 위해 package.json 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --only=production

# 빌더 스테이지에서 빌드된 애플리케이션 복사
COPY --from=builder /app/dist ./dist
# 빌더 스테이지에서 설치된 node_modules 복사
COPY --from=builder /app/node_modules ./node_modules
# Prisma 관련 파일 복사
COPY --from=builder /app/prisma ./prisma

# 파일 업로드 폴더를 Docker Volume으로 선언
# 이 볼륨은 호스트 머신에 마운트되어 업로드된 파일의 영속성을 보장합니다.
VOLUME /app/uploads

# 애플리케이션이 실행될 포트 노출
EXPOSE 3000

# 애플리케이션 실행 명령어
CMD ["node", "dist/app.js"]
