import jwt from 'jsonwebtoken';

const BEARER_PREFIX = 'Bearer';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    return res.status(401).json({ error: '인증 토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1]?.trim();


  if (!token) {
    return res.status(401).json({ message: '토큰이 존재하지 않습니다.' });
  }
  
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JMT_SECRET 환경변수가 설정되지 않았습니다.');
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('토큰 검증 실패:', err);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
