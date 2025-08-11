export function validateProduct(req, res, next) {
  const { name, description, price } = req.body;

  if (!name || !description || !price === undefined) {
    return res.status(400).json({ message: 'name, description, price는 필수입니다.' });
  }
  next();
}

export function validateArticle(req, res, next) {
  const { title, content } = req.body;
  
  if (!title || !content ) {
    return res.status(400).json({ message: 'title과 content는 필수입니다.' });
  }

  next();
}

export function validateComment(req, res, next) {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ message: '댓글 내용(content)은 필수입니다.' })
  }
  
  next();
}

