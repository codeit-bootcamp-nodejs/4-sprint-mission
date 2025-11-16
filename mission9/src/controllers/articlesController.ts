import { Request, Response } from 'express';
import { create } from 'superstruct';
import prismaClient from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import { Prisma, Like } from '@prisma/client';

export async function createArticle(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, CreateArticleBodyStruct);

  const article = await prismaClient.article.create({
    data: {
      ...data,
      userId: req.user.id,
    },
  });

  res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id },
    include: {
      likes: true,
    },
  });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  const articleWithLikes = {
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: req.user ? article.likes.some((like: Like) => like.userId === req.user.id) : undefined,
  };

  res.send(articleWithLikes);
}

export async function updateArticle(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  const updatedArticle = await prismaClient.article.update({ where: { id }, data });
  res.send(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  await prismaClient.article.delete({ where: { id } });
  res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: {
      likes: true,
    },
  });

  const articlesWithLikes = articles.map((article: Prisma.ArticleGetPayload<{ include: { likes: true } }>) => ({
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: req.user ? article.likes.some((like: Like) => like.userId === req.user.id) : undefined,
  }));

  res.send({
    list: articlesWithLikes,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const createdComment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId: req.user.id,
    },
  });

  res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
}

export async function createLike(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await prismaClient.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (existingLike) {
    throw new BadRequestError('Already liked');
  }

  await prismaClient.like.create({ data: { articleId, userId: req.user.id } });
  res.status(201).send();
}

export async function deleteLike(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await prismaClient.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (!existingLike) {
    throw new BadRequestError('Not liked');
  }

  await prismaClient.like.delete({ where: { id: existingLike.id } });
  res.status(204).send();
}
