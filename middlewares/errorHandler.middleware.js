export function errorHandler(err, req, res, next) {
  console.error("🔥 서버 에러 발생:", err);

  // 기본 상태코드 (500: 서버 내부 에러)
  const statusCode = err.statusCode || 500;

  // 클라이언트에 보낼 응답 형식 통일
  res.status(statusCode).json({ message: err.message || "서버에서 문제가 발생했습니다." });
}