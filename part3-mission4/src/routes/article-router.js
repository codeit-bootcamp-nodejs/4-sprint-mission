import express from 'express';
import { articleController } from '../controllers/article-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isArticleOwner, isCommentOwner } from '../middlewares/authorize.js';

const router = express.Router();

// 게시글 전체 조회 / 생성
router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    authenticate,
    validation.validate(validation.articleSchema),
    articleController.createArticle
  );

// 단일 게시글 조회 / 수정 / 삭제
router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    isArticleOwner,
    validation.validate(validation.articleUpdateSchema),
    articleController.updateArticle
  )
  .delete(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    isArticleOwner,
    articleController.deleteArticle
  );

// 게시글 좋아요 / 취소
router
  .route('/:id/like')
  .post(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    articleController.likeArticle
  )
  .delete(
    authenticate,
    validation.validateParam('id', validation.idSchema),
    articleController.unlikeArticle
  );

export default router;
