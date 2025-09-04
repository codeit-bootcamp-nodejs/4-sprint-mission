import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';

// '선택적' 인증 미들웨어
// 인증에 성공하면 req.user에 사용자 정보를 담고,
// 인증에 실패해도 에러를 발생시키지 않고 다음 미들웨어로 진행합니다.
export default async function (req, res, next) {
  try {
    const { authorization } = req.headers;
    // authorization 헤더가 없으면 그냥 통과
    if (!authorization) {
      return next();
    }

    const [tokenType, token] = authorization.split(' ');
    // Bearer 토큰이 아니면 그냥 통과
    if (tokenType !== 'Bearer') {
      return next();
    }

    // JWT 검증
    const decodedToken = jwt.verify(token, 'custom-secret-key');
    const userId = decodedToken.userId;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    // 사용자가 없으면 그냥 통과
    if (!user) {
      return next();
    }

    // req.user에 사용자 정보 할당
    req.user = user;
    next();
  } catch (err) {
    // JWT 관련 에러가 발생하면 (만료, 형식 오류 등) 그냥 통과
    // 이렇게 하면 유효하지 않은 토큰을 가진 사용자는 비로그인 사용자와 동일하게 취급됩니다.
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return next();
    }
    // 그 외의 서버 에러는 다음 에러 핸들러로 넘깁니다.
    next(err);
  }
}
