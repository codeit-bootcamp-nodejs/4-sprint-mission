import { Request, Response, NextFunction } from 'express';

export class ValidationMiddleware {
  validateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, tags } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: '상품 이름이 없습니다.' });
    }
    if (typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ error: '상품 설명이 없습니다.' });
    }
    if (typeof price !== 'number') {
      return res.status(400).json({ error: '상품의 가격은 숫자여야 합니다.' });
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      return res
        .status(400)
        .json({ error: '상품 태그는 1개 이상 포함된 배열이어야 합니다.' });
    }
    next();
  };

  validateArticle = (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: '게시글의 제목이 없습니다.' });
    }
    if (typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: '게시글의 내용이 없습니다.' });
    }
    next();
  };

  validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id || req.params.commentId;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: '유효하지 않은 ID 형식입니다.' });
    }
    next();
  };
}