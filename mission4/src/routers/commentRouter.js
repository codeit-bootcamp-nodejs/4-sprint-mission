import express from 'express';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';

const router = express.Router();

router.post(
  '/comments/products/:id',
  passport.authenticate('access-token', { session: false }),
  createProductComment
);
router.post(
  '/comments/articles/:id',
  passport.authenticate('access-token', { session: false }),
  createArticleComment
);
router.patch('/comments/:id', modifyComment);
router.patch('/comments/:id', deleteComment);
router.get(
  '/comments/products',
  passport.authenticate('access-token', { session: false }),
  productCommentList
);
router.get(
  '/comments/articles',
  passport.authenticate('access-token', { session: false }),
  articleCommentList
);

async function createProductComment(req, res, next) {
    const productId = Number(req.params.id);
    const { content } = req.body;
    const user = req.user;

    try {
      const comment = await prisma.comment.create({
        data: {
        content,
        productId,
        articleId: null,
        userId: user.id
        }
      });

      res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

async function createArticleComment(req, res, next) {
    const articleId = Number(req.params.id);
    const { content } = req.body;
    const user = req.user;

    try {
      const comment = await prisma.comment.create({
        data: {
        content,
        productId: null,
        articleId,
        userId: user.id
        }
      });

      res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

async function modifyComment(req, res, next) {
    const commentId = Number(req.params.id);
    const { content } = req.body;
    const user = req.user;
    const check = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    
    if (user.id !== check.userId) {
      return res.status(404).json({ message: 'User not matched'})
    }

    try {
      const updated = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
      });
      res.status(201).json(updated);
    } catch (err) {
        next(err);
    }
};

async function deleteComment(req, res) {
    const commentId = Number(req.params.id);
    const user = req.user;
    const check = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    
    if (user.id !== check.userId) {
      return res.status(404).json({ message: 'User not matched'})
    }

    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(204).end();
    } catch (err) {
        next(err);
    }
};

async function productCommentList(req, res, next) {
      const productId = parseInt(req.query.id) || 1;
      const lastId = req.query.lastId ? parseInt(req.query.lastId) : null; //cursor 방식의 pagination을 하기 위한 lastId 상수 지정
       try {
    const comments = await prisma.comment.findMany({
      where: { //article이 아니고 product의 comment를 골라내기 위해 만든 함수
        AND: [
          {
        articleId: null
        },{
        productId
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
    next(err);
  }
};

async function articleCommentList(req, res, next) {
      const articleId = parseInt(req.query.id) || 1;
      const lastId = req.query.lastId ? parseInt(req.query.lastId) : null;
       try {
    const comments = await prisma.comment.findMany({
      where: { //위와 반대로 product이 아니고 article의 comment를 골라내기 위해 만든 함수
        AND: [
          {
        articleId
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
    next(err);
  }
};

  router.use((err, req, res, next) => { //에러 미드웨어 설정
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found' });
    }

    console.error('unhandled Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  });

export default router;
