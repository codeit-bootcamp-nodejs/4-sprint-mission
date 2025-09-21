import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser; // Or a more specific subset of PrismaUser if only certain fields are always present
    }
  }
}
