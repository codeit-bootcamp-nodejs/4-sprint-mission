import type { RequestHandler } from 'express';
import { idSchema } from '@/validations/sharedSchema.js';

const parentIdParser: RequestHandler = (req, res, next) => {
  const { id } = idSchema.parse(req.params);
  req.parentId = id;
  return next();
};
export default parentIdParser;
