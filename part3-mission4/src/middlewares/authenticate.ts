import prisma from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';

async function authenticate(req, res, next) {
  try {
    // 쿠키 또는 Authorization 헤더에서 토큰 가져오기
    const tokenFromCookie = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    const tokenFromHeader = req.headers.authorization?.split(' ')[1];
    const accessToken = tokenFromCookie || tokenFromHeader;

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized: 미제공 토큰' });
    }

    // 토큰 검증
    const { userId } = verifyAccessToken(accessToken);

    // DB에서 유저 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: 유저를 찾을 수 없음' });
    }

    // req.user에 최소 정보만 저장
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res
      .status(401)
      .json({ message: 'Unauthorized: 유효하지 않거나 만료된 토큰' });
  }
}

export default authenticate;
