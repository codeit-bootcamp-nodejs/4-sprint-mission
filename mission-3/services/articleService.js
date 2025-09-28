import { PrismaClient } from "@prisma/client";
import { getListValidator, idValidator } from "../validators/struct.js";
import { create, assert } from "superstruct";
import { createValidator, patchValidator } from "../validators/articleStruct.js";
import errorHandler from '../middlewares/routerErrorHandler.js'

const prisma = new PrismaClient();

function getArticleList(){
    return errorHandler(async (req, res)=>{
        const {keyword, page, nums} = create(req.query, getListValidator)
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
    })
}

function createArticle(){
    return errorHandler(async (req, res)=>{
        assert(req.body, createValidator);
        const {title, content} = req.body;
        const article = await prisma.article.create({
            data: {
                title,
                content,
            }
        })
        res.status(201).json(article);
    })
}

function getArticle(){
    return errorHandler(async (req, res)=>{
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
    })
}

function patchArticle(){
    return errorHandler(async (req, res)=>{
        assert(req.body, patchValidator)
        const id = create(req.params, idValidator);
        const data = req.body;
        const article = await prisma.article.update({
            where: id,
            data,
        })
        res.status(200).json(article);
    })
}

function deleteArticle(){
    return errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const article = await prisma.article.delete({
            where: id,
        })
        res.status(200).json(article);
    })
}

export {getArticleList, createArticle, getArticle, patchArticle, deleteArticle}
