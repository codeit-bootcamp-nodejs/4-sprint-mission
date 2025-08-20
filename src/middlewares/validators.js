// 간단 유효성 검증 미들웨어

export function validateProduct(req, res, next) {
  const { name, description, price, tags } = req.body;
  if (!name || typeof name !== 'string' || !name.trim())
    return res.status(400).json({ message: 'name은 필수입니다.' });
  if (!description || typeof description !== 'string' || !description.trim())
    return res.status(400).json({ message: 'description은 필수입니다.' });
  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0)
    return res.status(400).json({ message: 'price는 0 이상의 숫자여야 합니다.' });
  if (tags && !Array.isArray(tags))
    return res.status(400).json({ message: 'tags는 문자열 배열이어야 합니다.' });
  next();
}

export function validateArticle(req, res, next) {
  const { title, content } = req.body;
  if (!title || typeof title !== 'string' || !title.trim())
    return res.status(400).json({ message: 'title은 필수입니다.' });
  if (!content || typeof content !== 'string' || !content.trim())
    return res.status(400).json({ message: 'content는 필수입니다.' });
  next();
}

export function validateComment(req, res, next) {
  const { content } = req.body;
  if (!content || typeof content !== 'string' || !content.trim())
    return res.status(400).json({ message: 'content는 필수입니다.' });
  next();
}
