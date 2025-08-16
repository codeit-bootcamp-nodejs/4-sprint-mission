module.exports = (err, req, res, next) => {
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: err.message || '잘못된 요청입니다.' });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ message: err.message || '리소스를 찾을 수 없습니다.' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ message: '대상을 찾을 수 없습니다.' });
  }

  console.error(err);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
};