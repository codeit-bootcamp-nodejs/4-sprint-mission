import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { getTestPrisma } from './dbHelper';
import { generateTokens } from '../../src/lib/token';

const prisma = getTestPrisma();

export interface TestUser {
  user: User;
  accessToken: string;
  password: string;
}

/**
 * Create a test user with hashed password
 */
export async function createTestUser(
  overrides: Partial<{
    email: string;
    nickname: string;
    password: string;
    image: string;
  }> = {}
): Promise<TestUser> {
  const password = overrides.password || 'Test1234!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: overrides.email || `test-${Date.now()}@example.com`,
      nickname: overrides.nickname || `TestUser${Date.now()}`,
      password: hashedPassword,
      image: overrides.image || null,
    },
  });

  const { accessToken } = generateTokens(user.id);

  return { user, accessToken, password };
}

/**
 * Create multiple test users
 */
export async function createTestUsers(count: number): Promise<TestUser[]> {
  const users: TestUser[] = [];
  for (let i = 0; i < count; i++) {
    const user = await createTestUser({
      email: `test-${Date.now()}-${i}@example.com`,
      nickname: `TestUser${Date.now()}-${i}`,
    });
    users.push(user);
  }
  return users;
}

/**
 * Get authentication cookie string for supertest
 */
export function getAuthCookie(accessToken: string): string {
  return `access-token=${accessToken}`;
}
