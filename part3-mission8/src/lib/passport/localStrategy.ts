import * as PassportLocal from 'passport-local';
const LocalStrategy = PassportLocal.Strategy;
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient.js';
import type { AuthUser } from '../../types/authenticated-request.js';
import type { IVerifyOptions } from 'passport-local';

export const localStrategy = new LocalStrategy(async function (
  username: string,
  password: string,
  done: (error: unknown, user?: AuthUser | false, info?: IVerifyOptions) => void
) {
  try {
    // 1) 유저 조회
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true, // 비교를 위해 필요하지만 최종 결과엔 안 넣음
      },
    });

    if (!user) {
      // 로그인 실패: 유저 없음
      return done(null, false);
    }

    // 2) 비번 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // 로그인 실패: 비번 틀림
      return done(null, false);
    }

    // 3) 민감정보 제거하고 AuthUser 형태로 변환
    const safeUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // 4) 로그인 성공
    return done(null, safeUser);
  } catch (err) {
    // DB 오류 등
    return done(err);
  }
});
