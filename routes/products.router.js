//product router
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationProduct, validateProduct } = require('../middlewares/validation.middleware.js');

//registration router
router.post('/products', validateProduct, async (req, res, next) => {
    try {
        const { name, description, price, tags } = req.body;
        const product = await prisma.product.create({
            data: { name, description, price, tags },
        });
        res.status(201).json(product);
    }   catch(error) {
        next(error);
    }
})

//cherck router
router.ger('/products', async (req, res, next) => {
    try {
        const { sort, search } = req.query;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' }},
                { description: { contains: search, mode: 'insentive'
                } },
            ],
        }
        : {};
        const products = await prisma.product.findMany({
            where,
            select: { id: true, name: true, price: true, createdAt: true, imageUrl: true },
            orderBy: sort === 'recent' ? { createdAt: 'desc' } : undefined,
            skip: offset,
            take: limit,
        });
        res.status(200).json(products);
    }   catch (error) {
        next(error);
    }
});

//datail, modify, delete
router
 .route('/products/:productId')
 .get(async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            select: { id: true, name: true, description: true, price: true,
                 tags: true, createdAt: true, imageUrl: true },
            });
            if (!product) return res.status(404).json({ message: '상품을 찾을수 없습니다.'});
            res.status(200).json(product);
        }   catch (error) {
            next(error);
        }
        })
        .patch(validateProduct, async (req, res, next) => {
            try {
                const { productid } = req.params;
                const { name, description, price, tags } = req.body;
                const updatedProduct = await prisma.product.update({
                    where: { id: parseInt(productID) },
                    data: { name, description, price, tags },
                });
                res.status(200).json(updatedProduct);
            }   catch (error) {
                next(error);
            }
        })
        .delete(async (req, res, next) => {
            try {
                const { productId } = req.params;
                await prisma.product.delete({ where: { id: parseInt(productId) }});
                res.status(204).send();
            }   catch (error) {
                next(error);
            }
        });

//comment
router.post('/products/:productId/comments', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { comment } = req.body
        if (!comment) return res.status(400).json({ message: '댓글을 입력해주세요.' });

        const newComment = await prisma.productComment.create({
            data: {
                comment,
                productId: parseInt(productId),
            },
        });
        res.status(201).json(newComment);
    }   catch (error) {
        next(error);
    }
});

//comment check
router.get('/products/:productId/comments', async (req, res, next) => {
    try {
        const { productId } = req.params;
        let cursor = req.query.cursor ? parseInt(req.query.cursor): undefined;
        let limit = parseInt(req.query,limit) || 10;

        const comments = await prisma.productComment.findMany({
            where: { productId: parseInt(productId) },
            select: { id: true, comment: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
            take: limit,
            skip: cursor ? 1 : 0,
        });
        res.status(200).json(comments);
    }   catch (error) {
        next(error);
    }
});

//comment modify
router.patch('/products/comments/:commentId', async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        if (!comment) return res.status(400).json({ message: '수정할 내용을 입력해주세요.'});

        const updatedComment = await prisma.productComment.update 
({
         where: { id: parseInt(commentId) },
         data: { content },
     });
        res.status(200).json(updatedComment);
    }   catch (error) {
        next(error);
    }
});

//comment delete
router.delete('/products/comments/:commentId', async (req, res, next) => {
    try {
        const { commentId } = req.params;
        await prisma.productComment.delete({ where: { id: parseInt(commentId) }});
        res.status(204).send();
    }   catch(error) {
        next(error);
    }
});

module.exports = router;