# ----------------------------------------------------------------------
# 1단계: 빌드 스테이지 (Builder Stage)
# ----------------------------------------------------------------------
ARG NODE_VERSION=
FROM node:${NODE_VERSION}-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

RUN apt-get update && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# ----------------------------------------------------------------------
# 2단계: 실행 스테이지 (Runtime Stage)
# ----------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runner

WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]