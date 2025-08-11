import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { validateArticle } from '../middlewares/validate.js';

const router = express.Router();

// 게시글 등록
router.post('/', validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newArticle = await prisma.article.create({ data: { title, content } });
    res.status(201).json(newArticle);
  } catch (error) {
    next (error);
  } 
});

// 게시글 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, search = '' } = req.query;
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive'} },
          { content: { contains: search, mode: 'insensitive'} },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
    });
    res.status(200).json(article);
  } catch (error) {
    next (error);
  }
});

// 게시글 상세 조회
router.get('/:id' , async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: '유효한 숫자 ID를 입력해주세요.' })
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' })
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
});

// 게시글 수정
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    if (isNaN(id)) return res.status(400).json({ error: '유효한 숫자 ID를 입력해주세요.' });

    const exiting = await prisma.article.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const updated = await prisma.article.update({
      where: { id },
      data: { ...(title && { title }), ...(content && { content }) },
     });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  } 
});

// 게시글 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: '유효한 숫자 ID를 입력해주세요.' });

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    await prisma.article.delete({ where: { id } });
    res.status(200).json({ message: `게시글(id: ${id}이 삭제되었습니다.` });
  } catch (error) {
    next (error);
  }
});

export default router;

