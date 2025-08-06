import express from 'express';
import { PrismaClient } from '@prisma/client';
import articleCommentRouter from './articleComentRouter.js';

const articleRouter = express.Router();
const prisma = new PrismaClient();

articleRouter.use(express.json());
articleRouter.use('/:id/comment', (req, res, next) =>{
    req.parentId = parseInt(req.params.id);
    next();
}, articleCommentRouter);

articleRouter.route('/')
    .get(async (req, res)=>{
        const {keyword, page = 0} = req.query;
        const take = 10;
        const skip = parseInt(page)*take;
        const where = keyword ? {
            OR: [
                { title: { contains: keyword }},
                { content: { contains: keyword }}
            ]
        } : {};
        try{
            const getArticle = await prisma.article.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            })
            res.status(200).json(getArticle);
        }catch(e){
            console.error(e)
            res.status(500).json({error: 'server error'})
        }
    })
    .post(async (req, res)=>{
        const {title, content} = req.body;
        try{
            const createArticle = await prisma.article.create({
                data: {
                    title,
                    content,
                }
            })
            res.status(201).json(createArticle);
        }catch(e){
            console.error(e);
            res.status(500).json({error: 'server error'});
        }
    })

articleRouter.route('/:id')
    .get(async (req, res)=>{
        const id = parseInt(req.params.id);
        try{
            const getArticle = await prisma.article.findUniqueOrThrow({
                where: { id },
                select:{
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                }
            })
            res.status(200).json(getArticle);
        }catch(e){
            console.error(e)
            if(e.code === 'P2025'){
                res.status(404).json({error: '해당 게시글을 찾을 수 없습니다.'})
            }else{
                res.status(500).json({error:'server error'})
            }
        }
    })
    .patch(async (req, res)=>{
        const id = parseInt(req.params.id);
        const data = req.body;
        try{
            const patchArticle = await prisma.article.update({
                where: { id },
                data,
            })
            res.status(200).json(patchArticle);
        }catch(e){
            console.error(e)
            if(e.code === 'P2025'){
                res.status(404).json({error: '해당 게시글을 찾을 수 없습니다.'})
            }else{
                res.status(500).json({error:'server error'})
            }
        }
    })
    .delete(async (req, res)=>{
        const id = parseInt(req.params.id);
        try{
            const deleteArticle = await prisma.article.delete({
                where: { id }
            })
            res.status(200).json(deleteArticle);
        }catch(e){
            console.error(e)
            if(e.code === 'P2025'){
                res.status(404).json({error: '해당 게시글을 찾을 수 없습니다.'})
            }else{
                res.status(500).json({error:'server error'})
            }
        }
    })

export default articleRouter;
