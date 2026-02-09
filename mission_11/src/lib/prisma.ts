import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.NODE_ENV === 'production'
          ? process.env.PRODUCTION_DATABASE_URL
          : process.env.DATABASE_URL,
    },
  },
});

export default prisma;