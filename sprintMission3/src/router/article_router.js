import express from 'express';
import { PrismaClient } from '@prisma/client'; 
import { asyncHandler } from '../asyncHandler.js';
import { createArticleValidator, 
  patchArticleValidator } from '../middleware/validationMiddleWare.js';

const articleRouter = express.Router();
const prisma = new PrismaClient();

articleRouter.route('/')
  .post(createArticleValidator, asyncHandler(async (req, res) => {
    const data = req.body;
    const newArticle = await prisma.article.create({
      data,
      select: {
        title: true,
        content: true,
      },
    });
    console.log('새로운 게시글이 생성되었습니다.', newArticle) 
    return res.status(201).json(newArticle);
  }))

  .get(asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = 'recent', title = '', content = '' } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);

    if( isNaN(skip) || isNaN(take) || skip < 0 || take < 0 ){ 
          console.log('페이지네이션 설정값은 양수로 설정해야합니다.') 
          return res.status(400).json({ error: '페이지네이션 설정값은 양수로 설정해야합니다.'});
      }
    let orderBy;
    switch (order) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    const articleList = await prisma.article.findManyOrThrow({
      where: { 
        OR :[
        {title: {contains: title}},
        {content: {contains: content}},
        ],
      }, 
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      orderBy,
      skip,
      take,
    });
    console.log('게시글 목록을 조회합니다.', articleList)
    return res.status(200).json(articleList);
  }));

  

articleRouter.route('/:id')
  .get(asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const detailedArticle = await prisma.article.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
     },
    }); 
    console.log('게시글을 상세 조회합니다.', detailedArticle)
    return res.status(200).json(detailedArticle);
  }))

  .patch(patchArticleValidator, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body
    const updateToData = {};
    if(!title == undefined){
      updateToData.title = title;
    }
    if(!content == undefined){
      updateToData.content = content;
    }
    const updatedArticle = await prisma.article.update({
      where: { id } ,
      data:  updateToData 
    });
    console.log('게시글이 수정되었습니다.', newArticle) 
    return res.status(200).json(updatedArticle);
  }))

  .delete(asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    await prisma.article.delete({
      where: { id },
    });
    res.status(204).send(); 
  }));

export default articleRouter;
