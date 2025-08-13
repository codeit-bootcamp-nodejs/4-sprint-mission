const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      include: { product: true, article: true },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(req.params.id) },
      include: { product: true, article: true },
    });
    if (!comment) {
      return next({ name: 'NotFoundError', message: '댓글이 없습니다.' });
    }
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { content, productId, articleId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, productId, articleId },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id: Number(req.params.id) },
      data: { content },
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.comment.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;