# 1. Node.js
FROM node:20.13.1

WORKDIR /app

COPY package*.json ./
RUN npm install

# Prisma generate
RUN npx prisma generate

COPY . .

RUN mkdir -p /app/uploads

# TypeScript 빌드
RUN npx tsc

EXPOSE 3000
CMD ["npm", "start"]
