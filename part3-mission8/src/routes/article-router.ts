import express from 'express';
import { articleController } from '../controllers/article-controller.js';
import { validation } from '../middlewares/validation.js';
import { isArticleOwner } from '../middlewares/authorize.js';
import { accessAuth } from '../lib/passport/index.js';

const router = express.Router();

// 게시글 조회, 생성
router
  .route('/')
  .get(
    validation.validateParam('id', validation.idSchema),
    articleController.getAllArticles
  )
  .post(
    accessAuth,
    validation.validate(validation.articleSchema),
    articleController.createArticle
  );

// 게시글  상세 조회, 수정, 삭제
router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    isArticleOwner,
    validation.validate(validation.articleUpdateSchema),
    articleController.updateArticle
  )
  .delete(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    isArticleOwner,
    articleController.deleteArticle
  );

// 게시글 좋아요, 좋아요 취소
router
  .route('/:id/like')
  .post(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    articleController.likeArticle
  )
  .delete(
    accessAuth,
    validation.validateParam('id', validation.idSchema),
    articleController.unlikeArticle
  );

export default router;
