import express from 'express';
import { articleController } from '../controllers/article-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isArticleOwner } from '../middlewares/authorize.js';

const router = express.Router();

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    authenticate,
    validation.validate(validation.articleSchema),
    articleController.createArticle
  );

router
  .route('/:id')
  .get(articleController.getArticleById)
  .patch(
    authenticate,
    validation.validate(validation.articleUpdateSchema),
    isArticleOwner,
    articleController.updateArticle
  )
  .delete(authenticate, isArticleOwner, articleController.deleteArticle);

// 댓글 조회, 생성
router
  .route('/:id/comments')
  .get(articleController.getComments) // articleId 기준 댓글 목록
  .post(
    authenticate,
    validation.validate(validation.commentSchema),
    articleController.createComment
  );

// 특정 댓글 조회, 수정, 삭제
router
  .route('/:id/comments/:commentId')
  .get(articleController.getCommentById)
  .patch(
    authenticate,
    isArticleOwner, // 필요에 따라 comment 소유자 확인 미들웨어로 바꿀 수 있음
    validation.validate(validation.commentSchema),
    articleController.updateComment
  )
  .delete(
    authenticate,
    isArticleOwner, // 필요에 따라 comment 소유자 확인 미들웨어로 바꿀 수 있음
    articleController.deleteComment
  );

export default router;
