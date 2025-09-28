import express from 'express';
import commentRouter from './comment.js';
import parentIdParser from '../middlewares/parnetIdParser.js';
import { getArticleList, createArticle, getArticle, deleteArticle, patchArticle } from '../services/articleService.js';

const articleRouter = express.Router();

articleRouter.use('/:id/comment', parentIdParser, commentRouter);

articleRouter.route('/')
    .get(getArticleList())
    .post(createArticle())

articleRouter.route('/:id')
    .get(getArticle())
    .patch(patchArticle())
    .delete(deleteArticle())

export default articleRouter;
