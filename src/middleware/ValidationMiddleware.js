import express from 'express';

const app = express();

// 상품 등록 시 필드의 유효성을 검증하는 미들웨어
export function productsValidation(req, res, next) {
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
  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: '상품 태그는 배열이어야 합니다.' });
  }
  if (tags.length === 0) {
    return res
      .status(400)
      .json({ error: '상품의 태그는 최소 1개 이상이어야 합니다.' });
  }
  next();
}

// id 유효성을 검증하는 미들웨어
export function productIdValidation(req, res, next) {
  const { id } = req.params;

  if (Number.isNaN(parseInt(id))) {
    return res.status(400).json({ error: '유효하지 않은 ID 형식입니다.' });
  }

  next();
}

// 게시물 등록 시 필요한 필드의 유효성을 검증하는 미들웨어
export function articlesValidation(req, res, next) {
  const { title, content } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: '게시글의 제목이 없습니다.' });
  }
  if (typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: '게시글의 내용이 없습니다.' });
  }

  next();
}
