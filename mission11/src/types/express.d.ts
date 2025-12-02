/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

export {};