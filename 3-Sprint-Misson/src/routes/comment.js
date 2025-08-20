import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// 중고마켓 댓글 등록 API
router.post('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: { content, productId: Number(productId) },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: '댓글 등록 실패' });
  }
});

//자유게시판 댓글 등록 API
router.post('/article/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: { content, articleId: Number(articleId) },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: '댓글 등록 실패' });
  }
});

//댓글 수정 API
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '댓글 수정 실패' });
  }
});

//댓글 삭제 API
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({ where: { id: Number(id) } });
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '댓글 삭제 실패' });
  }
});

//중고마켓 댓글 목록 조회 API
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  const { cursor, take = 10 } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      take: Number(take),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { id: 'asc' },
      select: { id: true, content: true, createdAt: true },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: '조회 실패' });
  }
});

//자유게시판 댓글 목록 조회 API
router.get('/article/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const { cursor, take = 10 } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: Number(articleId) },
      take: Number(take),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { id: 'asc' },
      select: { id: true, content: true, createdAt: true },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: '조회 실패' });
  }
});

export default router;

