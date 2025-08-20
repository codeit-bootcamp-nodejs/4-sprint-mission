import express from 'express';
import { assert } from 'superstruct';
import asyncHandler from '../core/middlewares/asyncHandler.js';
import { validateId } from '../core/middlewares/validateId.js';
import { CreateArticle, PatchArticle, CreateComment } from '../validators/structs.js';
import { articleService } from '../services/articleService.js';

const articleRouter = express.Router();

// 게시글 목록 조회 및 생성
articleRouter
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const articles = await articleService.getAllArticles(req.query);
      res.json(articles);
    }),
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const article = await articleService.createArticle(req.body);
      res.status(201).json(article);
    }),
  );

// 게시글 상세 조회, 수정, 삭제
articleRouter
  .route('/:id')
  .get(
    validateId,
    asyncHandler(async (req, res) => {
      const article = await articleService.getArticleById(req.params.id);
      res.json(article);
    }),
  )
  .patch(
    validateId,
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);
      const article = await articleService.updateArticle(req.params.id, req.body);
      res.json(article);
    }),
  )
  .delete(
    validateId,
    asyncHandler(async (req, res) => {
      await articleService.deleteArticle(req.params.id);
      res.sendStatus(204);
    }),
  );

// 게시글 댓글 조회 및 생성
articleRouter
  .route('/:id/comments')
  .get(
    validateId,
    asyncHandler(async (req, res) => {
      const result = await articleService.getArticleComments(req.params.id, req.query);
      res.json(result);
    }),
  )
  .post(
    validateId,
    asyncHandler(async (req, res) => {
      assert(req.body, CreateComment);
      const comment = await articleService.createCommentForArticle(req.params.id, req.body);
      res.status(201).json(comment);
    }),
  );

export default articleRouter;
