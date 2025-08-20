import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createCommentValidator, 
  patchCommentValidator } from '../middleware/validationMiddleWare.js';
import { asyncHandler } from '../asyncHandler.js';

const prisma = new PrismaClient();
const productCommentRouter = express.Router();

productCommentRouter.route('/')
  .post(createCommentValidator, asyncHandler(async(req,res)=>{
    const { content, articleId, userId } = req.body;
    const newProductComment = await prisma.comment.create({
      data: {
        content,
        articleId: parseInt(articleId),
        userId: parseInt(userId)
      }
    });
    console.log('새로운 상품 댓글을 생성했습니다.', newProductComment)
    return res.status(201).json(newProductComment);
  }))


productCommentRouter.route('/:id') 
  .patch(patchCommentValidator, asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id); 
    const { content, productId } = req.body;
    const updateToData = {};
    if(content !== undefined){
      updateToData.content = content;
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: updateToData,
    });
    console.log('요청하신 댓글이 수정되었습니다.', updatedComment)
    return res.status(201).json(updatedComment);
  }))

  .delete(asyncHandler(async(req,res)=>{
    const id = parseInt(req.params.id)
    await prisma.comment.delete({
      where: { id },
    })
    console.log('요청하신 상품 댓글을 삭제했습니다.')
    return res.staus(204).send()
  }))

   .get(asyncHandler(async(req, res)=>{
     const id = parseInt(req.params.id);
     const { offset = 0, limit = 10 } = req.query;
     const skip = parseInt(offset);
     const take = parseInt(limit);
     const artcleCommentList = await prisma.comment.findUniqueOrThrow({
       where: { id },
       select: {
         id: true,
         content: true,
         createdAt: true,
       },
       skip,
       take, 
       cursor : {
         id: myCusor,
       }
     })
     console.log('요청하신 상품 목록을 조회했습니다.', artcleCommentList)
     return res.status(201).json({artcleCommentList});
   }));

export default productCommentRouter;