import { PrismaClient } from "@prisma/client";
import { getListValidator, commentValidator } from "../validators/commentStruct.js";
import { idValidator } from "../validators/struct.js";
import errorHandler from "../middlewares/routerErrorHandler.js";
import { create, assert } from 'superstruct';

const prisma = new PrismaClient();

function getCommentList(){
    return errorHandler(async (req, res) =>{
        const {page, cursorId, nums} = create(req.query, getListValidator);
        const parentType = req.parentType;
        const where = parentType === 'product'
            ? { productId: { not: null }} : {articleId: { not: null }};
        const comment = await prisma.comment.findMany({
            where,
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
    })
}

function createComment(){
    return errorHandler(async (req, res)=>{
        assert(req.body, commentValidator);
        const id = req.parentId;
        const parentType = req.parentType;
        const {content} = req.body;
        const comment = await prisma.comment.create({
            data: {
                content,
                [parentType]: {
                    connect:{
                        id,
                    }
                }
            },
            include: {
                [parentType]: true,
            }
        })
        res.status(201).json(comment);
    })
}

function patchComment(){
    return errorHandler(async (req, res)=>{
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
    })
}

function deleteComment(){
    return errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const comment = await prisma.comment.delete({
            where: id,
        })
        res.status(200).json(comment)
    })
}

export {getCommentList, createComment, patchComment, deleteComment};
