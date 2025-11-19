import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import prisma from '@/lib/prisma.js';
import { fileURLToPath } from 'url';
import { connectToRedis, redisClient } from '@/lib/redis.js';
import { jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../../.env.test'), override: true });

const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(async () => {
  await connectToRedis();
  console.error = jest.fn();
  console.log = jest.fn();
});

beforeEach(async () => {
  const tableNames = [
    'products',
    'articles',
    'product_comments',
    'article_comments',
    'product_images',
    'article_images',
    'users',
    'tags',
    'article_likes',
    'product_likes',
  ];
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;`,
  );
});

afterAll(async () => {
  await prisma.$disconnect();
  await redisClient.quit();

  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});
