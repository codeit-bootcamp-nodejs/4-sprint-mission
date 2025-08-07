import express from 'express';
import { PrismaClient } from '@prisma/client';
import articleCommentRouter from './articleCommentRouter.js';
import parentIdParser from '../middlewares/parnetIdParser.js';
import errorHandler from '../middlewares/routerErrorHandler.js';
import { assert, create } from 'superstruct';
import { createArticle, patchArticle } from '../validators/articleStruct.js';
import { idValidator, getList } from '../validators/struct.js';

const articleRouter = express.Router();
const prisma = new PrismaClient();

articleRouter.use('/:id/comment', parentIdParser, articleCommentRouter);

articleRouter.route('/')
    .get(errorHandler(async (req, res)=>{
        const {keyword, page, nums} = create(req.query, getList)
        const article = await prisma.article.findMany({
            where: {
                OR: [
                    {title: { contains: keyword }},
                    {content: { contains: keyword }},
                ]
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: page*nums,
            take: nums,
        })
        res.status(200).json(article);
    }))
    .post(errorHandler(async (req, res)=>{
        assert(req.body, createArticle);
        const {title, content} = req.body;
        const article = await prisma.article.create({
            data: {
                title,
                content,
            }
        })
        res.status(201).json(article);
    }))

articleRouter.route('/:id')
    .get(errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const article = await prisma.article.findUniqueOrThrow({
            where: id,
            select:{
                id: true,
                title: true,
                content: true,
                createdAt: true,
            }
        })
        res.status(200).json(article);
    }))
    .patch(errorHandler(async (req, res)=>{
        assert(req.body, patchArticle)
        const id = create(req.params, idValidator);
        const data = req.body;
        const article = await prisma.article.update({
            where: id,
            data,
        })
        res.status(200).json(article);
    }))
    .delete(errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const article = await prisma.article.delete({
            where: id,
        })
        res.status(200).json(article);
    }))

export default articleRouter;
