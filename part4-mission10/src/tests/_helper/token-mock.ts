import { jest } from '@jest/globals';

export type Tokens = { accessToken: string; refreshToken: string };

export const generateTokens = jest.fn<(userId: number) => Tokens>(() => ({
  accessToken: 'A.T',
  refreshToken: 'R.T',
}));

export const verifyRefreshToken = jest.fn<
  (token: string) => { userId: number }
>(() => ({ userId: 7 }));

// default 있어도 되지만, 테스트에서는 named export로 쓰는 걸 권장
export default { generateTokens, verifyRefreshToken };
