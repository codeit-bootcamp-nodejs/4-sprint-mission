import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { name, description, price } = req.body;
  if (!name || !description || price == null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (typeof price !== 'number' || price < 0) {
    res.status(400).json({ error: 'Price must be a non-negative number' });
    return;
  }
  next();
};

export const validateProductPatch = (req: Request, res: Response, next: NextFunction): void => {
  const { name, description, price, tags, imageUrl } = req.body;
  if (
    name == null &&
    description == null &&
    price == null &&
    tags == null &&
    imageUrl == null
  ) {
    res.status(400).json({ error: 'At least one field is required' });
    return;
  }
  if (price != null && (typeof price !== 'number' || price < 0)) {
    res.status(400).json({ error: 'Price must be a non-negative number' });
    return;
  }
  next();
};

export const validateArticle = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  next();
};

export const validateArticlePatch = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;
  if (title == null && content == null) {
    res.status(400).json({ error: 'At least one field is required' });
    return;
  }
  next();
};
