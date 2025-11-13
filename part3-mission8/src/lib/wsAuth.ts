import { verifyAccessToken } from './token.js';

// 소켓 handshake로부터 받은 token(raw)을 받아서 userId를 뽑아주는 함수
export function parseUserIdFromToken(rawToken: unknown): number | null {
  if (typeof rawToken !== 'string') {
    return null;
  }

  try {
    const { userId } = verifyAccessToken(rawToken); // <- token.ts에서 온 거 그대로 사용
    if (typeof userId !== 'number') return null;
    return userId;
  } catch (err) {
    // 토큰 만료 / 위조 등으로 verifyAccessToken이 에러 던지면 여기로 옴
    return null;
  }
}
