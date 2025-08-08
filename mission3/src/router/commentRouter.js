import { PrismaClient } from '@prisma/client';
import express from 'express';
import { string } from 'zod';

const commentRouter = express.Router();

const prisma = new PrismaClient();

commentRouter.route('/')
  .post(async(req, res) => {
    const target = req.query.target;
    const targetId = parseInt(req.query.targetId);
    const { content } = req.body;
    let data = {};
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
      res.status(500).json({ eror: "Failed to create comment" });
    }
  });

commentRouter.route('/:id') 
  .patch(async(req, res) => { //id를 통해서 comment 수정하기
    const commentId = Number(req.params.id);
    const { content } = req.body;

    try {
      const updated = await prisma.comment.update({
        data: {
          content,
        },
      });
      res.status(201).json(updated);
    } catch (err) {
      res.status(500).json({ error: `Failed to modify comment` });
    }
  })

  .delete(async(req, res) => { //id를 통해서 comment 삭제하기
    const commentId = Number(req.params.id);

    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      res.json({ message: 'Comment deleted' });
    } catch (err) {
      res.status(500).json({ error: `Can't deleted your comment` });
    }
  });

  commentRouter.route('/product')
    .get(async(req, res) => {
      const targetId = parseInt(req.query.targetId);
      const lastId = req.query.lastId ? parseInt(req.query.lastId) : null;
       try {
    const comments = await prisma.comment.findMany({
      where: {
        AND: [
          {
        articleId: null
        },{
        productId: targetId
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
    res.status(404).json({ error: `Can't find comments`});
  }
 });

   commentRouter.route('/article')
    .get(async(req, res) => {
      const targetId = parseInt(req.query.targetId);
      const lastId = req.query.lastId ? parseInt(req.query.lastId) : null;
       try {
    const comments = await prisma.comment.findMany({
      where: {
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
    res.status(404).json({ error: `Can't find comments`});
  }
 });

 //하나의 코드로 article과 product의 덧글을 조회하려고 했는데 targetId 대상 외 거르는 과정이 너무 어렵네요 ㅠ
// commentRouter.route('/')
//  .get(async(req, res ) => { 
//   const target = req.query.target;
//   const targetId = parseInt(req.query.targetId);
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
//     res.status(404).json({ error: `Can't find comments`});
//   }
//  });

export default commentRouter;
