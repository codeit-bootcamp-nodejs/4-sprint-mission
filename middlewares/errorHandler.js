export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.stack || 500).json({
    error: err.message || '서버 오류가 발생했습니다.',
  }); 
}