import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  try {
    // 요청 헤더에서 토큰 꺼내기
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: " 토큰이 없습니다." });
    }

    // "Bearer 토큰값" 형태 에서 "토큰값"만 분리
    const token = authHeader.split(" ")[1];

    // 토큰 검증 ( 비밀키는 .env에 저장)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰 안에 있는 유저 정보
    req.user = {
      ...decoded,
      userId: Number(decoded.userId),
    };
    console.log("decoded token:", decoded);

    next();
  } catch (err) {
    console.error("JWT 검증 실패:", err.message);
    return res.status(401).json({ success: false, message: "유효하지 않는 토큰입니다." });
  }
}

