import { PrismaClient } from '@prisma/client';
import express from 'express';

const commentRouter = express.Router();

const prisma = new PrismaClient();

commentRouter.route('/')
  .post(async(req, res) => { //target query를 통해서 'articleId'와 'productId' 중 하나의 정보를 받고, targetId query를 통해서 세부 Id 정보를 받음
    const target = req.query.target;
    const targetId = parseInt(req.query.targetId);
    const { content } = req.body;
    let data = {}; // target query에 알맞는 데이터 형식을 갖도록 만든 함수
    if (target === 'article') {
      data = { articleId: targetId, content }
    } else if (target === 'product') {
      data = { productId: targetId, content }
    } else {
      return res.status(400).json({ error: "Wrong target" });
    };
    try {
      const comment = await prisma.comment.create({
        data
      });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

commentRouter.route('/:id') 
  .patch(async(req, res) => { //Id 정보를 받고서 대조 후 알맞는 comment를 찾아 수정하기
    const commentId = Number(req.params.id);
    const { content } = req.body;

    try {
      const updated = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
      });
      res.status(201).json(updated);
    } catch (err) {
      res.status(404).json({ error: 'Failed to modify comment' });
    }
  })

  .delete(async(req, res) => { //id를 통해서 comment 찾기 후 삭제하기
    const commentId = Number(req.params.id);

    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      res.tatus(204).json({ message: 'Comment is deleted' });
    } catch (err) {
      res.status(404).json({ error: 'Failed to delete data' });
    }
  });

  commentRouter.route('/product')
    .get(async(req, res) => { //targetId를 통해 지정된 product의 comment를 불러오기
      const targetId = parseInt(req.query.targetId) || 1;
      const lastId = req.query.lastId ? parseInt(req.query.lastId) : null; //cursor 방식의 pagination을 하기 위한 lastId 상수 지정
       try {
    const comments = await prisma.comment.findMany({
      where: { //article이 아니고 product의 comment를 골라내기 위해 만든 함수
        AND: [
          {
        articleId: null
        },{
        productId: targetId
         },
        ],
      },
     take: 5, //첫 불러내는 comment가 총 5개 이고 lastId가 지정이 안되면 skip 의 값은 0이 되고 있다면 1로 설정
     skip: lastId ? 1: 0,
     ...(lastId && { cursor: { id: lastId } }), //lastId의 값이 있을때 괄호가 풀어지며 내부의 'cursor: { id: lastId }가 작동함
      select: {
          id: true,
          content: true,
          createdAt: true,
      },
    });
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Failed to find comment' })
  }
 });

   commentRouter.route('/article')
    .get(async(req, res) => { //targetId를 통해 지정된 article의 comment를 불러오기
      const targetId = parseInt(req.query.targetId) || 1;
      const lastId = req.query.lastId ? parseInt(req.query.lastId) : null;
       try {
    const comments = await prisma.comment.findMany({
      where: { //위와 반대로 product이 아니고 article의 comment를 골라내기 위해 만든 함수
        AND: [
          {
        articleId: targetId
        },{
        productId: null
         },
        ],
      },
     take: 5,
     skip: lastId ? 1: 0,
     ...(lastId && { cursor: { id: lastId } }),
      select: {
          id: true,
          content: true,
          createdAt: true,
      },
    });
    res.status(201).json(comments);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Failed to find comment' })
  }
 });

// 코드의 줄이 짧으면 짧으수록 좋다는 멘토님의 말씀이 떠올라서 1차적으로 target query 를 통해서 articleId, productId를 구별하도록 만들고
// targetId query를 통해서 세부 Id를 비교해서 comment를 찾아내면서 targetId가 없을 경우 target의 유형의 comment를 전부
// 불러오는 방법에서 막혔습니다..

// commentRouter.route('/')
//  .get(async(req, res ) => { 
//   const target = req.query.target;
//   const targetId = parseInt(req.query.targetId) || 1;
//   let purpose = {};
//   if (target === 'articleId') {
//     purpose = {articleId: targetId}
//   } else if (target === 'productId') {
//     purpose = {productId: targetId}
//   } else {
//     return res.status(400).json({ error: "Wrong target" });
//   };
//     try {
//     const comments = await prisma.comment.findMany({
//       where: {
//         ...purpose
//       },
//       select: {
//           id: true,
//           content: true,
//           createdAt: true,
//       },
//     });
//     res.status(201).json(comments);
//   } catch (err) {
//     console.error(err);
//     res.status(404).json({ error: 'Failed to find comment' })
//   }
//  });

export default commentRouter;
