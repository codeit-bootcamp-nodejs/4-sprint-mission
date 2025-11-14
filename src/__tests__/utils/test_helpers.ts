//src/__tests__/utils/test_helpers.ts
  import { prisma as mainPrisma } from '../../lib/prisma';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';

  export const prisma = mainPrisma;

  export async function clearDatabase() {
    await prisma.notification.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.productLike.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
  }

  export async function createTestUser(data?: {
    email?: string;
    nickname?: string;
    password?: string;
  }) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);

    const hashedPassword = await bcrypt.hash(data?.password || 'password123', 10);

    return await prisma.user.create({
      data: {
        email: data?.email || `testuser_${timestamp}_${random}@test.com`,
        nickname: data?.nickname || `테스트유저_${timestamp}`,
        password: hashedPassword,
      },
    });
  }

  export function generateToken(userId: number, email: string): string {
    return jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || 'test-secret-key',
      { expiresIn: '7d' }
    );
  }