import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import optionalAuthMiddleware from '../middlewares/optional-auth.middleware.js';

const router = express.Router();

// 게시글 생성
router.post('/articles', authMiddleware, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { id: userId } = req.user;

    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    return res.status(201).json({ data: article });
  } catch (err) {
    next(err);
  }
});

// 게시글 목록 조회
router.get('/articles', async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.status(200).json({ data: articles });
  } catch (err) {
    next(err);
  }
});

// 게시글 상세 조회
router.get('/articles/:articleId', optionalAuthMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const user = req.user;

    const article = await prisma.article.findUnique({
      where: { id: +articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    let isLiked = false;
    if (user) {
      const like = await prisma.articleLike.findUnique({
        where: {
          userId_articleId: {
            userId: user.id,
            articleId: +articleId,
          },
        },
      });
      if (like) {
        isLiked = true;
      }
    }

    const responseArticle = { ...article, isLiked };

    return res.status(200).json({ data: responseArticle });
  } catch (err) {
    next(err);
  }
});

// 게시글 수정
router.put('/articles/:articleId', authMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { title, content } = req.body;
    const { id: userId } = req.user;

    if (!title && !content) {
      return res.status(400).json({ message: '수정할 정보를 하나 이상 입력해주세요.' });
    }

    const article = await prisma.article.findUnique({ where: { id: +articleId } });
    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    if (article.authorId !== userId) {
      return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: +articleId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    return res.status(200).json({ data: updatedArticle });
  } catch (err) {
    next(err);
  }
});

// 게시글 삭제 
router.delete('/articles/:articleId', authMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { id: userId } = req.user;

    const article = await prisma.article.findUnique({ where: { id: +articleId } });
    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    if (article.authorId !== userId) {
      return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
    }

    await prisma.article.delete({ where: { id: +articleId } });

    return res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

/** 게시글 좋아요/좋아요 취소 **/
router.post('/articles/:articleId/like', authMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { id: userId } = req.user;

    // 게시글이 존재하는지 확인
    const article = await prisma.article.findUnique({ where: { id: +articleId } });
    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 사용자가 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: +articleId,
        },
      },
    });

    // 좋아요가 이미 있다면 삭제(좋아요 취소), 없다면 생성(좋아요)
    if (existingLike) {
      await prisma.articleLike.delete({
        where: {
          userId_articleId: {
            userId,
            articleId: +articleId,
          },
        },
      });
      return res.status(200).json({ message: '게시글 좋아요를 취소했습니다.' });
    } else {
      await prisma.articleLike.create({
        data: {
          userId,
          articleId: +articleId,
        },
      });
      return res.status(200).json({ message: '게시글에 좋아요를 눌렀습니다.' });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
