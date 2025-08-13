const express = require('express');
const { PrismaClient } = require('@prisma/client');
const validateArticle = require('../middlewares/validateArticle');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      include: { comments: true },
    });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      include: { comments: true },
    });
    if (!article) {
      return next({ name: 'NotFoundError', message: '게시글이 없습니다.' });
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data: { title, content },
    });
    res.json(article);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.article.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;