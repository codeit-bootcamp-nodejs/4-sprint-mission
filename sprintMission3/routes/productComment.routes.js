import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateComment } from '../middlewares/validate.js';
import { createProductCommentLike, deleteProductCommentLike } from '../controller/productCommentLike.controller.js';

const router = express.Router();

// 상품 댓글 좋아요 추가
router.post('/:commentId/like', verifyToken, createProductCommentLike);

// 상품 댓글 좋아요 취소
router.delete('/:commentId/like', verifyToken, deleteProductCommentLike);

// 상품 댓글 목록 조회 (cursor 기반)
router.get('/:productId', async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { cursor, take = 5 } = req.query;
    if (isNaN(productId)) {
      return res.status(400).json({ error: '유효한 상품 ID를 입력해주세요.' });
    }
    const comments = await prisma.productComment.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: Number(take),
      ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    next (error);
  }
});

// 상품 댓글 등록
router.post('/', validateComment, async (req, res, next) => {
  try {
    const { content, productId } = req.body;
    if (!content || !productId) {
      return res.status(400).json({ error: 'content와 productId는 필수입니다.' });
    }
    const newComment = await prisma.productComment.create({
      data: {
        content,
        productId: Number(productId),
       },
    });

    res.status(201).json(newComment);
  } catch (error) {
    next (error);
  }
});

// 상품 댓글 수정
router.patch('/:commentId', async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    if (isNaN(commentId)) {
      return res.status(400).json({ error: '유효한 댓글 ID를 입력해주세요.' });
    }
    const existingComment = await prisma.productComment.findUnique({ where : { id: commentId } })
    if (!existingComment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }
    const updatedComment = await prisma.productComment.update({
      where: { id: commentId },
      data: { content },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    next (error);
  }
});

// 상품 댓글 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.productComment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }
    await prisma.productComment.delete({ where: { id } });
    res.status(200).json({ message: `댓글(id: ${id})이 삭제되었습니다.` });
  } catch (error) {
    next (error);
  }
});

export default router;