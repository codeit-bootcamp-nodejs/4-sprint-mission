//adricle router
const express = require('express');
const router = express.Router();
const { PrismaClient } =require('@prisma/client');
const prisma = new PrismaClient();
const { validateArticle } = require('../middlewares/validation.middleware.js');

//article registration 
router
 .route('/articles')
 .post(validateArticle, async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const article = await prisma.article.create({ data: { title, content }});
        res.status(201).json(article);
    }   catch (error) {
        next(error);
    }
})
 .get(async (req, res, next) => {
    try {
        const { sort, search } = req.query;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const where = search
          ? {
            OR: [
                { title: { contains: search, mode: 'insenstive' }},
                { content: { constains: search, mode: 'insenstive' }},
            ],
          }
          : {};

          const articles = await prisma.article.findMany({
            where,
            select: { id: true, title: true, content: true, createdAt: true },
            orderBy: sort === 'recent' ? { createdAt: 'desc' } : undefined,
            skip: offset,
            take: limit,
          });
          res.status(200).json(articles);
        } catch (error) {
            next(error);
        }
    });

//article detail, modify, delete
router
 .route('/articles/:articleId')
 .get(async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const article = await prisma.article.findUnique({
            where: { id: parseInt(articleId) },
            select: { id: true, title: true, content: true, createdAt: true },
        });
        if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.'});
        res.status(200).json(article);
    }   catch (error) {
        next(error);
    }
})
 .patch(validateArticle, async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { title, content } = req.body;
        const updatedArticle = await prisma.article.update({
            where: { id: parseInt(articleId) },
            data: { title, content },
        });
        res.status(200).json(updatedArticle);
    }   catch (error) {
        next(error);
    }
})
 .delete(async (req, res, next) => {
    try {
        const { articleId } = req.params;
        await prisma.article.delete({ where: { id: parseInt(articleId) }});
        res.status(204).send();
    }   catch (error) {
        next(error);
    }
    });

//article API
router.post('/articles/:articleId/comments', async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: '댓글을 입력해주세요.'});
        
        const newComment = await prisma.articleComment.create({
            data: {
                content,
                articleId: parseInt(articleId),
            },
        });
        res.status(201).json(newComment);
    }   catch (error) {
        next(error);
    }
});
   
// article check
router.get('/articles/:articleId/comments', async (req, res, next) => {
    try {
        const { articleId } = req.params;
        let cursor = req.query.cursor ? parseInt(req.query.cursor): undefined;
        let limit = parseInt(req.query.limit) || 10;

        const comments = await prisma.articleComment.findMany({
            where: { articleId: parseInt(articleId) },
            select: { id: true, content: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
            take: limit,
            skip: cursor ? 1 : 0,
        });
        res.status(200).json(comments);
    } catch(error) {
        next(error);
    }
});

//article modify
router.patcch('/articles/comments/:commentId', async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: '수정할 내용을 입력하세요.' });

        const updatedComment = await prisma.articleComment.update
        ({
            where: { id: parseInt(commentId) },
            data: { content },
        });
        res.status(200).json(updatedComment);
    }   catch (error) {
        next(error)
    }
});

//article delete
router.delete('/articles/comments/:commentId', async (req, res, next) => {
    try {
        const { commentId } = req.params;
        await prisma.articleComment.delete({ where: { id: parseInt(commetId) }});
        res.status(204).send();
    }   catch (error) {
        next(error);
    }
});

module.exports = router;