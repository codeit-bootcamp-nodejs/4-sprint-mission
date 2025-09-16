export { errorHandler };

// 수정 (default export로)
export default function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || '서버 오류가 발생했습니다.' });
}