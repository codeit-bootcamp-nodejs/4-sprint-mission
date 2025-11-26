import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  createLike,
  deleteLike,
} from '../controllers/articlesController';
import authenticate from '../middlewares/authenticate';

const articlesRouter = express.Router();

articlesRouter.post('/', authenticate(), withAsync(createArticle));
articlesRouter.get('/', authenticate({ optional: true }), withAsync(getArticleList));
articlesRouter.get('/:id', authenticate({ optional: true }), withAsync(getArticle));
articlesRouter.patch('/:id', authenticate(), withAsync(updateArticle));
articlesRouter.delete('/:id', authenticate(), withAsync(deleteArticle));
articlesRouter.post('/:id/comments', authenticate(), withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));
articlesRouter.post('/:id/likes', authenticate(), withAsync(createLike));
articlesRouter.delete('/:id/likes', authenticate(), withAsync(deleteLike));

export default articlesRouter;
