const express = require('express');
const { PrismaClient } = require('@prisma/client');
const validateProduct = require('../middlewares/validateProduct');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { comments: true },
    });
    if (!product) {
      return next({ name: 'NotFoundError', message: '상품이 없습니다.' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, tags, imageUrl },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags, imageUrl } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, description, price, tags, imageUrl },
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;