import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateId,
  validateCommentId,
  validateArticleData,
  validateCommentData,
  validateArticleUpdateData,
} from './validation.js';

const router = express.Router();
const prisma = new PrismaClient();

// 게시글 목록 조회 API
router
  .route('/')
  .get(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // 페이지
    const limit = parseInt(req.query.limit) || 10; // 노출 항목
    const sort = req.query.sort || 'recent'; // 정렬 설정
    const keyword = req.query.keyword || ''; // 키워드 설정
    const skip = (page - 1) * limit; // 넘길 항목수
    let orderBy;
    switch (sort) {
      case 'resect':
        orderBy = { createdAt: 'desc' };
        break;
      case 'old':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }
    let where;
    if (keyword) {
      where = {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      };
    }
    const articles = await prisma.article.findMany({
      skip,
      take: limit,
      where, // 검색 조건 적용
      orderBy, // 정렬 조건 적용
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        createdAt: true,
      },
    });
    const totalArticles = await prisma.article.count({ where }); // 검색 조건에 맞는 총 게시글 수
    const totalPages = Math.ceil(totalArticles / limit);
    res.json({
      articles,
      pagination: {
        totalArticles,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  })
  // 게시글 작성 API
  .post(validateArticleData, async (req, res) => {
    const { title, content, author } = req.body;
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        author,
      },
    });
    res.status(201).json(newArticle);
  });

// 게시글 상세 조회 API

router
  .route('/:id')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      return res.status(400).json({ message: '존재하지 않는 게시글입니다.' });
    }
    res.status(200).json(article);
  })
  // 게시글 수정 API
  .patch(validateId, validateArticleUpdateData, async (req, res) => {
    const { id } = req.params;
    const { updateData } = req.body;
    const updateArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.status(200).json(updateArticle);
  })
  // 게시글 삭제 API
  .delete(validateId, async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  });
// 댓글

//댓글 생성, 목록 조회
router
  .route('/:id/comments')
  .post(validateId, validateCommentData, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: parseInt(id) },
        },
      },
    });

    res.status(201).json(newComment);
  })
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        articleId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(comments);
  });
// 댓글 상세조회, 수정, 삭제
router
  .route('/:id/comments/:commentId')
  .get(validateId, validateCommentId, async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        articleId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(comment);
  })
  .patch(validateCommentId, validateCommentData, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const updateComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    res.status(200).json(updateComment);
  })
  .delete(validateCommentId, async (req, res) => {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res.status(204).send();
  });

export default router;
