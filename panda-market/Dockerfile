# 빌드 스테이지
ARG NODE_VERSION
# local version = 22.16.0
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# 실행 스테이지
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN npm ci --only=prod && npm cache clean --force

ENTRYPOINT [ "npm", "run", "start" ]
