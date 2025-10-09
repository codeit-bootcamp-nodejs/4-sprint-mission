export function validateArticle(req, res, next) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
  }

  next();
}