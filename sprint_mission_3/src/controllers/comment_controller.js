// src/controllers/comment.controller.js
import prisma from '../prisma/client.js';

export const createProductComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        product: { connect: { id: parseInt(req.params.productId) } },
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const createArticleComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        article: { connect: { id: parseInt(req.params.articleId) } },
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getProductComments = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(req.params.productId) },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      ...(cursor && { skip: 1, cursor: { id: parseInt(cursor) } }),
      select: { id: true, content: true, createdAt: true },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const getArticleComments = async (req, res, next) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(req.params.articleId) },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      ...(cursor && { skip: 1, cursor: { id: parseInt(cursor) } }),
      select: { id: true, content: true, createdAt: true },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const updated = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    next(err);
  }
};
