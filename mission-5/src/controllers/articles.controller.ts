import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.util.js';

export class ArticlesController {
  // 게시글 생성
  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

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
  };

  // 게시글 목록 조회
  getArticles = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  // 게시글 상세 조회
  getArticleById = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  // 게시글 수정
  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const { title, content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

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
  };

  // 게시글 삭제 
  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

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
  };

  // 게시글 좋아요/좋아요 취소
  toggleArticleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      const article = await prisma.article.findUnique({ where: { id: +articleId } });
      if (!article) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      const existingLike = await prisma.articleLike.findUnique({
        where: {
          userId_articleId: {
            userId,
            articleId: +articleId,
          },
        },
      });

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
  };
}
