export function notFound(req, res, next) {
  res.status(404).json({ message: '리소스를 찾을 수 없습니다.' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return;
  const status = err.status || 500;
  res.status(status).json({
    message:
      status >= 500
        ? '서버 오류가 발생했습니다.'
        : err.message || '요청을 처리할 수 없습니다.'
  });
}
