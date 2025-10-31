import type { RequestHandler } from 'express';
import { idSchema } from '@/validations/sharedSchema.js';

const parentIdParser: RequestHandler = (req, res, next) => {
  const url = req.baseUrl;
  const { id } = idSchema.parse(req.params);
  req.parentId = id;

  if (url.startsWith('/product')) {
    req.parentType = 'products';
  } else if (url.startsWith('/article')) {
    req.parentType = 'articles';
  } else {
    return res.status(400).json({ error: '올바르지 않은 부모 타입입니다.' });
  }
  return next();
};
export default parentIdParser;
