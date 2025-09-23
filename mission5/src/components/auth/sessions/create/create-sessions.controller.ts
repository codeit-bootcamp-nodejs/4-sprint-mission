import type { NextFunction, Request, Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../../../config/constants.js';
import { createSessionService } from './create-sessions.service.js';
import { saveRefreshTokenToDB } from '@components/auth/tokens/save-refresh-tokens-to-db.repository.js';

/**
 * 로그인 시 세션 생성 컨트롤러
 * - 사용자 인증
 * - 액세스/리프레시 토큰 발급
 * - 리프레시 토큰 DB 저장
 * - 토큰을 HTTP-only 쿠키로 클라이언트 전송
 */

export async function createSessionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    // 사용자 인증 및 토큰 생성
    const { user, accessToken, refreshToken } = await createSessionService(
      email,
      password,
    );
    // 리프레시 토큰을 DB에 저장
    await saveRefreshTokenToDB(user.id, refreshToken);
    
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
    });
    // 엑세스 토큰 쿠키 설정
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict', // CSRF 공격 방지
    });
    // 클라이언트에 사용자 정보 반환
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
}
