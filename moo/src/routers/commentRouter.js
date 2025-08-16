import express from 'express'
import prisma from '../client/prismaClient.js'
import { PatchComment } from '../validators/structor.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import { assert } from 'superstruct';

const router = express.Router();

// content를 입력하여 댓글을 등록합니다.
// 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.

router.patch('/:commentId', asyncHandler(async (req,res)=> {
    assert(req.body, PatchComment);
    const { commentId } = req.params;
    const parseId = parseInt(commentId);
    const { content } = req.body;
    const comment = await prisma.comment.update({
        where: {id: parseId},
        data: {content}
    });
    res.status(200).json(comment);
}));


//삭제
router.delete('/:commentId', asyncHandler(async (req,res) => {
    const { commentsId } =  req.params;
    const parseId = parseInt(commentsId);
    await prisma.comment.delete({
        where: {id: parseId},
    });
    res.sendStatus(204);
}));

export default router;


