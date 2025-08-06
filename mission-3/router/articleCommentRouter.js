import { PrismaClient } from '@prisma/client';
import express from 'express';

const articleCommentRouter = express.Router();
const prisma = new PrismaClient();

articleCommentRouter.route('/')
    .get(async (req, res) =>{
        const {page = 0, cursor = 0} = req.query;
        const cursorId = parseInt(cursor);
        const take = 10;
        const skip = take * parseInt(page);
        try{
            const getComment = await prisma.comment.findMany({
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                },
                take,
                skip,
                cursor:{
                    id: cursorId,
                }
            })
            res.status(200).json(getComment);
        }catch(e){
            console.error(e)
            res.status(500).json({error:'server error'});
        }
    })
    .post(async (req, res)=>{
        const id = req.parentId;
        const {content} = req.body;
        try{
            const createComment = await prisma.comment.create({
                data: {
                    content,
                    article: {
                        connect:{
                            id,
                        }
                    }
                },
                include: {
                    article: true,
                }
            })
            res.status(201).json(createComment);
        }catch(e){
            console.error(e)
            res.status(500).json({error:'server error'});
        }
    })

articleCommentRouter.route('/:id')
    .patch(async (req, res)=>{
        const id = parseInt(req.params.id);
        const {content} = req.body;
        try{
            const patchComment = await prisma.comment.update({
                where: { id },
                data: {
                    content,
                }
            })
            res.status(200).json(patchComment);
        }catch(e){
            console.error(e)
            if(e.code === 'P2025'){
                res.status(404).json({error:'해당 댓글이 존재하지 않습니다.'});
            }else{
                res.status(500).json({error:'server error'});
            }
        }
    })
    .delete(async (req, res)=>{
        const id = parseInt(req.params.id);
        try{
            const deleteComment = await prisma.comment.delete({
                where: {id}
            })
            res.status(200).json(deleteComment)
        }catch(e){
            console.error(e)
            if(e.code === 'P2025'){
                res.status(404).json({error:'해당 댓글이 존재하지 않습니다.'});
            }else{
                res.status(500).json({error:'server error'});
            }
        }
    })

export default articleCommentRouter;
