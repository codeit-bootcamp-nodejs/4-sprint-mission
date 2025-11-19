import { verifyAccessToken as realVerifyAccessToken } from './token.js';

export function parseUserIdFromToken(
  rawToken: unknown,
  // 테스트에서 주입 가능
  verify: (t: string) => { userId: number } = realVerifyAccessToken
): number | null {
  if (typeof rawToken !== 'string') return null;
  try {
    const { userId } = verify(rawToken);
    return typeof userId === 'number' ? userId : null;
  } catch {
    return null;
  }
}
