import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { io } from "../socket/socket.js";

const prisma = new PrismaClient();

const getArticles = async(req: Request, res: Response) => {
  const offset = typeof req.query.offset === 'string' ? req.query.offset : '0';
  const limit = typeof req.query.limit === 'string' ? req.query.limit : '10';
  const order = req.query.order === 'newest' ? 'asc' : 'desc';
  const search = req.query.search;
  const where = search ? {
    OR: [{ title: { contains: String(search), mode: 'insensitive' } },
    { content: { contains: String(search), mode: 'insensitive' } }
    ]
  } : {};
  const articles = await prisma.article.findMany({
    where,
    order,
    skip: parseInt(offset, 10),
    take: parseInt(limit, 10),
    select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      }
  });
  res.status(200).send(articles);
};

const createArticles = async(req: Request, res: Response) => {
  const userId = req.user.userId;
  const { title, content } = req.body;
  const articleData = {
    title,
    content,
    userId, // JWT에서 추출한 userId를 article 데이터에 추가
    };
  const article = await prisma.article.create({
    data: articleData
  });
  res.status(201).send(article);
};

const getArticleById = async(req: Request, res: Response) => {
  const articleId = Number(req.params.articleId)
  const article = await prisma.article.findUnique({
    where: { id: Number(req.params.articleId) },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
        }
      })
  const likeCount = await prisma.articleLike.count({
    where: { articleId : articleId}
  })
  const Liked = likeCount > 0;
  res.status(200).json({
    article, Liked
  });
};

const updateArticles = async(req: Request, res: Response) => {
  const article = await prisma.article.update({
    where: { id: Number(req.params.articleId) },
    data: req.body,
  });
  res.status(200).send(article);
}

const deleteArticles = async(req: Request, res: Response) => {
  await prisma.article.delete({
    where: { id: Number(req.params.articleId) },
  });
  res.status(204).send();
}

const getArticleComments = async(req: Request, res: Response) => {
  const articleComments = await prisma.articleComment.findMany({
    where: { articleId: Number(req.params.articleId) },
  });
  res.status(200).send(articleComments);
}

interface NotificationPayload {
  message: string;
  articleId?: number;
  productId?: number;
  createdAt: Date;
}

// 댓글 등록 시 알림 전송 transaction
const createArticleCommentWithNotifications = async (req: Request, res: Response) => {
  await prisma.$transaction(async (tx: PrismaClient) => {
// 상품 정보 수정
 const userId = req.user.userId;
 const articleId = req.params.articleId ? parseInt(req.params.articleId, 10) : undefined;
 const createArticleComment = await tx.articleComment.create({
    data: {
      content: req.body.content,
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    }
  });
  const article = await tx.article.findUnique({
  where: { id: articleId },
  select: { userId: true }
  });

  if (article) {
  const notification = await tx.notification.create({
          data: {
            userId: article.userId,
            message: "내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.",
            articleId: Number(req.params.articleId),
            createdAt: new Date()
          }
        })

  const payload: NotificationPayload = {
  message: notification.message,
  articleId: notification.articleId ?? undefined,
  productId: notification.productId ?? undefined,
  createdAt: notification.createdAt
};

  io.to(`user_${article.userId}`).emit("notification", payload);
    }

  res.status(200).send(createArticleComment);
  });
};

const updateArticleComment = async(req: Request, res: Response) => {
  const articleComments = await prisma.articleComment.update({
    where: { id: Number(req.params.articleCommentId) },
    data: req.body,
  });
  res.status(200).send(articleComments);
}

const deleteArticleComment = async(req: Request, res: Response) => {
  const articleComments = await prisma.articleComment.delete({
    where: { id: Number(req.params.articleCommentId) },
  });
  res.status(204).send(articleComments);
}

export default { 
  getArticles, 
  createArticles, 
  getArticleById, 
  updateArticles, 
  deleteArticles,
  getArticleComments,
  createArticleCommentWithNotifications,
  updateArticleComment,
  deleteArticleComment
};