import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articlesController';

const articlesRouter = express.Router();

articlesRouter.post('/', authenticate(), withAsync(createArticle));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.patch('/:id', authenticate(), withAsync(updateArticle));
articlesRouter.delete('/:id', authenticate(), withAsync(deleteArticle));

export default articlesRouter;
