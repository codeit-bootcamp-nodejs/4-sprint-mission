import { Prisma } from '@prisma/client';
import express from 'express';

const commentRouter = express.Router();

commentRouter.route('/products') //Product 구역에 comment 등록하기
  .post(async(req, res) => {
    const { content } = req.body;

    try {
      const comment = await Prisma.comment.create({
        data: {
          content,
        },
      });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ eror: "Failed to create comment" });
    }
  });

  commentRouter.route('/articles') //Article 구역에 comment 등록하기
  .post(async(req, res) => {
    const { content } = req.body;

    try {
      const comment = await Prisma.comment.create({
        data: {
          content,
        },
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
      const updated = await Prisma.comment.update({
        data: {
          content,
        },
      });
      res.json({ message: 'Modified your comment!' });
    } catch (err) {
      res.status(500).json({ error: `Failed to modify comment` });
    }
  })

  .delete(async(req, res) => { //id를 통해서 comment 삭제하기
    const commentId = Number(req.params.id);

    try {
      await Prisma.comment.delete({
        where: { id: commentId },
      });
      res.json({ message: 'Comment deleted' });
    } catch (err) {
      res.status(500).json({ error: `Can't deleted your comment` });
    }
  });

commentRouter.route('/products')
 .get(async(req, res) => { //Product 구역의 comment 조회하기

  try {
    const comments = await prisma.comment.findMnay({
      take: 5,
      skip: 1,
      cursor: { lastId },
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

commentRouter.route('/articles')
 .get(async(req, res) => { //Article 구역의 comment 조회하기

  try {
    const comments = await prisma.comment.findMnay({
      take: 5,
      skip: 1,
      cursor: { lastId },
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

export default commentRouter;
