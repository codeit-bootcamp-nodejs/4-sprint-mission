//src/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 가져오기
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1];

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 요청 객체에 사용자 ID 추가
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error('인증 오류:', error);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};