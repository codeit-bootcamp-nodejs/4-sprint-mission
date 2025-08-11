import express from 'express';
import {
  validateId,
  validateCommentId,
  validateArticleData,
  validateCommentData,
  validateArticleUpdateData,
} from './validation.js';
import { articleService, commentService } from './services.js';

const router = express.Router();

// 게시글 목록 조회 API
router
  .route('/')
  .get(async (req, res) => {
    const { articles, pagination } = await articleService.getAllArticles(
      req.query
    );
    res.send({ articles, pagination });
  })
  // 게시글 작성 API
  .post(validateArticleData, async (req, res) => {
    const { title, content, author } = req.body;
    const newArticle = await articleService.createArticle(
      title,
      content,
      author
    );
    res.status(201).json(newArticle);
  });

// 게시글 상세 조회 API
router
  .route('/:id')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);
    if (!article) {
      return res.status(400).json({ message: '존재하지 않는 게시글입니다.' });
    }
    res.status(200).json(article);
  })
  // 게시글 수정 API
  .patch(validateId, validateArticleUpdateData, async (req, res) => {
    const { id } = req.params;
    const { updateData } = req.body;
    const updateArticle = await articleService.updateArticle(id, updateData);
    res.status(200).json(updateArticle);
  })
  // 게시글 삭제 API
  .delete(validateId, async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete(id);
    res.status(204).send();
  });
// 댓글

//게시글 댓글 생성, 목록 조회
router
  .route('/:id/comments')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const comments = await commentService.getCommentsByArticleId(id);
    res.json(comments);
  })
  .post(validateId, validateCommentData, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const newComment = await commentService.createArticleComment(id, content);
    res.status(201).json(newComment);
  });
// 게시글 댓글 상세조회, 수정, 삭제
router
  .route('/:id/comments/:commentId')
  .get(validateId, validateCommentId, async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await commentService.getCommentByIdAndArticleId(
      id,
      commentId
    );
    res.json(comment);
  })
  .patch(validateCommentId, validateCommentData, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const updateComment = await commentService.updateComment(
      commentId,
      content
    );
    res.status(200).json(updateComment);
  })
  .delete(validateCommentId, async (req, res) => {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  });

export default router;
