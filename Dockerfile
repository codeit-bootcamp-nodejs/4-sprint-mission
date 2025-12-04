# 1. 빌드 스테이지
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 2. 실행 스테이지
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# 파일 업로드 폴더 생성 (볼륨 마운트 대상)
RUN mkdir -p /app/uploads 

EXPOSE 3000

# 서버 실행 명령어
CMD ["node", "dist/app.js"]