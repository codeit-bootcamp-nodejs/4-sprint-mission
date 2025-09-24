import { PrismaClient } from '../../generated/prisma/index.js';

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

// 개발 환경에서 hot reload 시 PrismaClient 중복 생성 방지
prisma = global.prisma;

export default prisma;
