import express, { Response } from 'express';
import * as articleService from '../services/articleService';
import { authenticate, optionalAuthenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page, pageSize, keyword } = req.query;
    const articles = await articleService.getArticles({
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      keyword: keyword as string,
    });
    res.status(200).json(articles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const article = await articleService.getArticleById(id);
    res.status(200).json(article);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

// Protected routes
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const article = await articleService.createArticle({
      title,
      content,
      userId: req.userId!,
    });
    res.status(201).json(article);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const article = await articleService.updateArticle(id, req.userId!, {
      title,
      content,
    });
    res.status(200).json(article);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : error.message.includes('not authorized') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await articleService.deleteArticle(id, req.userId!);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : error.message.includes('not authorized') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

export default router;
