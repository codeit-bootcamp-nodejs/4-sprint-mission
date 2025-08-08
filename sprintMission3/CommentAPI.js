import * as dotenv from 'dotenv';
import express, { application } from 'express';
import { PrismaClient } from '@prisma/client/extension';

dotenv.config();

const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 상품 댓글 작성
app.post('products/:id/comments', async (req, res) => {
  const productId = parseInt(req.params.id);
  const { content } = req.body;

  if (Number.isNaN(productId)) {
    return res.status(400).json({ error: '유효하지 않은 상품 ID입니다.' });
  }

  try {
    // 댓글 생성 후 상품 글과 연결 부분을 트랜잭션으로 처리
    const newComment = await prisma.$transaction(async (tx) => {
      // 댓글 생성
      const comments = await tx.comment.create({
        data: {
          content,
        },
      });

      // 댓글과 상품을 연결하는 productComment 생성
      await tx.productComment.create({
        data: {
          productId: productId,
          commentId: comments.id,
        },
      });
      return comments;
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 등록에 실패했습니다.' });
  }
});

// 게시글 댓글 작성
app.post('articles/:id/comments', async (req, res) => {
  const articleId = parseInt(req.params.id);
  const { content } = req.body;

  if (Number.isNaN(articleId)) {
    return res.status(400).json({ error: '유효하지 않은 게시글 ID입니다.' });
  }

  try {
    const newComment = await prisma.$transaction(async (tx) => {
      const comments = await tx.comment.create({
        data: {
          content,
        },
      });

      await tx.articleComment.create({
        data: {
          articleId: articleId,
          commentId: comments.id,
        },
      });
      return comments;
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 등록에 실패했습니다.' });
  }
});

// 댓글 수정
app.patch('/:parentType/:parentId/comments/:commentId', async (req, res) => {
  const { parentType, parentId, commentId } = req.params;
  const { content } = req.body;

  const parentIdNum = parseInt(parentId);
  const commentIdNum = parseInt(commentId);

  try {
    // 댓글 확인
    if (parentType === 'products') {
      const link = await prisma.productComment.findUnique({
        where: {
          productId_commentId: {
            productId: parentIdNum,
            commentId: commentIdNum,
          },
        },
      });
      if (!link) {
        return res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
      }
    } else if (parentType === 'articles') {
      const link = await prisma.articleComment.findUnique({
        where: {
          articleId_commentId: {
            articleId: parentIdNum,
            commentId: commentIdNum,
          },
        },
      });
      if (!link) {
        return res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
      }
    } else {
      return res.status(400).json({ error: '잘못된 경로입니다.' });
    }

    // 댓글 수정
    const updateComment = await prisma.comment.update({
      where: {
        id: commentIdNum,
      },
      data: {
        content,
      },
    });
    res.json(updateComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 수정에 실패했습니다.' });
  }
});

// 댓글 삭제
app.delete('/:parentType/:parentId/comments/:commentId', async (req, res) => {
  const { parentType, parentId, commentId } = req.params;

  const parentIdNum = parseInt(parentId);
  const commentIdNum = parseInt(commentId);

  try {
    // 댓글 확인
    if (parentType === 'products') {
      const link = await prisma.productComment.findUnique({
        where: {
          productId_commentId: {
            productId: parentIdNum,
            commentId: commentIdNum,
          },
        },
      });
      if (!link) {
        return res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
      }
    } else if (parentType === 'articles') {
      const link = await prisma.articleComment.findUnique({
        where: {
          articleId_commentId: {
            articleId: parentIdNum,
            commentId: commentIdNum,
          },
        },
      });
      if (!link) {
        return res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
      }
    } else {
      return res.status(400).json({ error: '잘못된 경로입니다.' });
    }

    // 댓글 삭제
    // onDelete를 사용하지만 명시적인 코드 작성
    await prisma.$transaction(async (tx) => {
      // 연결 레코드 삭제
      if (parentType === 'products') {
        await tx.productComment.delete({
          where: { commentId: commentIdNum },
        });
      } else if (parentType === 'articles') {
        await tx.articleComment.delete({
          where: { commentId: commentIdNum },
        });
      }
      // 원본 댓글 삭제
      await tx.comment.delete({
        where: { id: commentIdNum },
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
  }
});

// 댓글 목록 조회
app.get('/:parentType/:parentId/comments/', async (req, res) => {
  const { parentType, parentId } = req.params;
  const parentIdNum = parseInt(parentId);

  if (parentType !== 'products' && parentType !== 'articles') {
    return res.status(400).json({ error: '잘못된 경로입니다.' });
  }

  const limit = parseInt(req.query.limit || '10');
  const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;

  try {
    const comments = await prisma.comment.findMany({
      // parentType에 따른 필터링
      where: {
        ...(parentType === 'products' && {
          productComment: { productId: parentIdNum },
        }),
        ...(parentType === 'articles' && {
          articleComment: { articleId: parentIdNum },
        }),
      },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { id: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].id : null;

    res.json({
      data: comments,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 목록 조회에 실패했습니다.' });
  }
});
