import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import prisma from '@/lib/prisma.js';
import { beforeEach } from '@jest/globals';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../../.env.test'), override: true });

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.articleImage.deleteMany();
  await prisma.productImage.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
