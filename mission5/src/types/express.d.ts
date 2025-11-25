import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    // Passport req.user 타입을 Prisma User로 확장
    interface User extends PrismaUser {}
  }
}

// 반드시 export {} 필요
export {}; 