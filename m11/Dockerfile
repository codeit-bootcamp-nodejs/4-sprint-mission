# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# 캐시 최적화를 위해 package 파일만 먼저 복사
COPY package*.json ./
COPY prisma ./prisma/

# 의존성 설치 (dev 포함)
RUN npm ci

# Prisma Client 생성
RUN npx prisma generate

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

# 보안: non-root 유저 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# 소유권을 nodejs 유저로 변경
RUN chown -R nodejs:nodejs /app

# nodejs 유저로 전환
USER nodejs

# package 파일 복사
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs prisma ./prisma/

# production 의존성만 설치
RUN npm ci --omit=dev

# Prisma Client 생성
RUN npx prisma generate

# 빌드된 파일 복사
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

# uploads 디렉토리 생성
RUN mkdir -p /app/uploads

# 포트 노출
EXPOSE 3000

# 헬스체크 (애플리케이션 상태 확인)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 서버 시작
CMD ["node", "dist/server.js"]