import express from 'express';
import { articleController } from '../controllers/article-controller.js';
import { validation } from '../middlewares/validation.js';
import authenticate from '../middlewares/authenticate.js';
import { isArticleOwner, isCommentOwner } from '../middlewares/authorize.js';

const router = express.Router();
/**
 * 게시글 전체 조회 / 생성
 */
router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    authenticate,
    validation.validate(validation.articleSchema),
    articleController.createArticle
  );

/**
 * 단일 게시글 조회 / 수정 / 삭제
 */
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

/**
 * 게시글 좋아요 / 취소
 */
router
  .route('/:id/like')
  .post(authenticate, articleController.likeArticle)
  .delete(authenticate, articleController.unlikeArticle);

/**
 * 게시글 댓글 조회 / 생성
 */
router
  .route('/:id/comments')
  .get(articleController.getComments) // 게시글 ID 기준 댓글 목록
  .post(
    authenticate,
    validation.validate(validation.commentSchema),
    articleController.createComment
  );

/**
 * 단일 댓글 조회 / 수정 / 삭제
 */
router
  .route('/:id/comments/:commentId')
  .get(articleController.getCommentById)
  .patch(
    authenticate,
    isCommentOwner, // comment 소유자 확인
    validation.validate(validation.commentSchema),
    articleController.updateComment
  )
  .delete(authenticate, isCommentOwner, articleController.deleteComment);

/**
 * 댓글 좋아요 / 취소
 */
router
  .route('/:id/comments/:commentId/like')
  .post(authenticate, articleController.likeComment)
  .delete(authenticate, articleController.unlikeComment);

export default router;
