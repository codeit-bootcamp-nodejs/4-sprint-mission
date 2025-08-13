// src/controllers/article.controller.js
import prisma from '../prisma/client.js';

// Article 생성 API
export const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// Article 목록 조회 API
export const getAllArticles = async (req, res, next) => {
  try {
    const offset = Math.max(0, parseInt(req.query.offset ?? '0', 10) || 0);
    const limitRaw = parseInt(req.query.limit ?? '10', 10);
    const limit = Math.min(50, Math.max(1, limitRaw || 10)); // 1~50 범위
    const search = (req.query.search ?? '').trim();
    const sort = req.query.sort;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : undefined;

    const articles = await prisma.article.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy,
      select: { id: true, title: true, content: true, createdAt: true },
    });

    return res.json(articles);
  } catch (err) {
    next(err);
  }
};

// Article 상세 조회 API
export const getArticleById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    return res.json(article);
  } catch (err) {
    next(err);
  }
};

/// Article 수정 API
export const updateArticle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const { title, content } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;

    const updated = await prisma.article.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Article 삭제 API
export const deleteArticle = async (req, res, next) => {
  try {
    await prisma.article.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Article not found' });
    }
    next(err);
  }
};
