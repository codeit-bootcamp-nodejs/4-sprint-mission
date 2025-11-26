import { prisma } from './prisma-mock.js';

export async function setupPrismaMock() {
  jest.resetModules();
  // @ts-expect-error: unstable_mockModule은 타입 선언이 없음 (런타임 전용)
  await jest.unstable_mockModule('../../lib/prismaClient.js', () => ({
    __esModule: true,
    prisma,
    default: prisma,
  }));
}

// 필요할 때만 추가 모듈 주입
/*
await jest.unstable_mockModule('../../lib/token.js', () => ({
  __esModule: true,
  generateTokens: jest.fn().mockReturnValue({ accessToken: 'acc', refreshToken: 'ref' }),
  verifyRefreshToken: jest.fn().mockReturnValue({ userId: 7 }),
}));
await jest.unstable_mockModule('../../lib/constants.js', () => ({
  __esModule: true,
  NODE_ENV: 'test',
  ACCESS_TOKEN_COOKIE_NAME: 'AT',
  REFRESH_TOKEN_COOKIE_NAME: 'RT',
}));
*/
