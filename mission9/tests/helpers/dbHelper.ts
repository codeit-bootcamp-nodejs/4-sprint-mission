import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

/**
 * Setup test database - run migrations
 */
export async function setupTestDatabase() {
  try {
    // Run migrations on test database
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}

/**
 * Clean all data from test database
 */
export async function cleanDatabase() {
  try {
    // Delete in order to respect foreign key constraints
    // Use deleteMany instead of TRUNCATE to avoid deadlocks
    await prisma.notification.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Failed to clean database:', error);
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
}

/**
 * Get Prisma client for tests
 */
export function getTestPrisma() {
  return prisma;
}
