// types/express.d.ts
import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    // req.user → Prisma User 타입
    interface User extends Partial<PrismaUser> {}

    // req.user는 로그인 안 된 경우 undefined 가능
    interface Request {
      user?: User;
      validated?: {
        body?: ArticleBody;
        query?: ArticleQuery;
        params?: ArticleParams;
      };
    }
  }
}

export {};
