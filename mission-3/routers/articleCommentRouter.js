import { PrismaClient } from '@prisma/client';
import express from 'express';
import errorHandler from '../middlewares/routerErrorHandler.js';
import { assert, create } from 'superstruct';
import { commentValidator, getCommentList } from '../validators/commentStruct.js';
import { idValidator } from '../validators/struct.js';

const articleCommentRouter = express.Router();
const prisma = new PrismaClient();

articleCommentRouter.route('/')
    .get(errorHandler(async (req, res) =>{
        const {page, cursorId, nums} = create(req.query, getCommentList);
        const comment = await prisma.comment.findMany({
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            take: nums,
            skip: nums*page,
            cursor:{
                id: cursorId,
            }
        })
        res.status(200).json(comment);
    }))
    .post(errorHandler(async (req, res)=>{
        assert(req.body, commentValidator)
        const parentId = req.parentId;
        const {content} = req.body;
        const createComment = await prisma.comment.create({
            data: {
                content,
                article: {
                    connect:{
                        id: parentId,
                    }
                }
            },
            include: {
                article: true,
            }
        })
        res.status(201).json(createComment);
    }))

articleCommentRouter.route('/:id')
    .patch(errorHandler(async (req, res)=>{
        assert(req.body, commentValidator)
        const id = create(req.params, idValidator);
        const {content} = req.body;
        const comment = await prisma.comment.update({
            where: id,
            data: {
                content,
            }
        })
        res.status(200).json(comment);
    }))
    .delete(errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const comment = await prisma.comment.delete({
            where: id,
        })
        res.status(200).json(comment)
    }))

export default articleCommentRouter;
