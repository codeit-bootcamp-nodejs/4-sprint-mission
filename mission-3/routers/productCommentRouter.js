import { PrismaClient } from '@prisma/client';
import express from 'express';
import errorHandler from '../middlewares/routerErrorHandler.js';
import { commentValidator, getCommentList } from '../validators/commentStruct.js';
import { assert, create } from 'superstruct';
import { idValidator } from '../validators/struct.js';

const productCommentRouter = express.Router();
const prisma = new PrismaClient();

productCommentRouter.route('/')
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
        assert(req.body, commentValidator);
        const id = req.parentId;
        const {content} = req.body;
        const comment = await prisma.comment.create({
            data: {
                content,
                product: {
                    connect:{
                        id,
                    }
                }
            },
            include: {
                product: true,
            }
        })
        res.status(201).json(comment);
    }))
    
productCommentRouter.route('/:id')
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

export default productCommentRouter;
