import express from 'express'
import { PrismaClient } from '@prisma/client'
import { createComment } from '.../validate.js'
 import { z } from 'zod';

const prisma = new PrismaClient // 클래스라서 new 키워드로 인스턴스를 만듦

const app = express()
const commentRouter = express.Router()

app.use(express.json())



// 댓글 등록 로직을 재사용 가능한 함수 생성
const createCommentHandler = async (req, res, parentKey) => { // parentKey 는 post api 코드에 따라 변형 되어서 사용 가능
    try {//  Zod 스키마로 요청 본문 유효성 검사
        const { content } = createComment.parse(req.body);
        const parentId = req.params[parentKey]; 
        const comment = await prisma.comment.create({
            data: {
                content,
                [parentKey]: parentId
            }
        });
        res.status(201).json(comment);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: '댓글 등록 중 오류가 발생했습니다.' });
    }
};

// 댓글 수정 로직을 재사용 가능한 함수 생성
const updateCommentHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const { content } = commentSchema.parse(req.body);
        const updated = await prisma.comment.update({
            where: { id },
            data: { content },
        });
        res.status(200).json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
};

// 댓글 삭제 로직을 재사용 가능한 함수 생성
const deleteCommentHandler = async (req,res) => {
    const { id } = req.params
    try{
        await prisma.comment.delete({
            where: { id }
        })
        res.status(200).json({ message: '댓글이 삭제 되었습니다'})
    } catch (error) {
        res.status(404).json({message: '삭제할 댓글을 찾을 수 없습니다.'})
    }
}



// 댓글 등록 API : 중고마켓
commentRouter.post('/products/:productId/commnts', async (req, res) => { // 경로는 상품의 하나의 상품 중 댓글을 뜻 함
     await createCommentHandler(req,res,'productId') // parentKey에 productId 담기
})

// 댓글 등록 API : 자유게시판
commentRouter.post('/articles/:articleId/comments', async (req, res) => {
        await createCommentHandler(req, res, 'articleId');
    });

// 댓글 목록 조회 API : 중고마켓
commentRouter.get('/products/:id/comments', async(req, res) => {
    const { id } = req.params
    const { cursor, limit, order } = req.query

    const result = await makeCursor({
        parentId: id,
        parentKey: 'productId',
        cursor : cursor? { id : cursor } : 0,
        limit: parseInt(limit) || 10,
        order
    })
    res.status(200).json(result)
})

// 댓글 목록 조회 API : 자유게시판 
commentRouter.get('/articles/:id/comments', async(req,res) => {
    const { id } = req.params
    const { cursor, limit, order } = req.query

    const result = await makeCursor({
        parentId:  id,
        parentKey: 'articleId',
        cursor : cursor? { id : cursor } : 0,
        limit: parseInt(limit) || 10,
        order
    })
    res.status(200).json(result)
})

// 댓글 수정 API
commentRouter.patch('/comments/:id', updateCommentHandler);

// 댓글 삭제 API
commentRouter.delete('/comments/:id', deleteCommentHandler)






export default commentRouter;