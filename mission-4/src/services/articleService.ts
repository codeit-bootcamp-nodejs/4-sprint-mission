import type { GetListParams } from '@/types/shared.type.js';
import prisma from '../lib/prisma.js';
import type { PatchArticle, PostArticle, ArticleParams } from '@/types/article.types.js';
import { ForbiddenError } from '@/lib/errors.js';

async function authorization({ userId, articleId }: ArticleParams): Promise<boolean> {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
  });
  return article.userId === userId;
}

async function getArticleListService({ keyword, page, pageSize, userId }: GetListParams) {
  const articles = await prisma.article.findMany({
    where: {
      OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const results = articles.map((article) => {
    const { likes: _likes, _count, ...filteredArticle } = article;
    return {
      likeCount: article._count.likes,
      isLike: userId ? article.likes.length === 1 : false,
      ...filteredArticle,
    };
  });
  return results;
}

async function postArticleService({ userId, title, content }: PostArticle) {
  const article = await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });
  return article;
}

async function getArticleService({ articleId, userId }: ArticleParams) {
  const article = await prisma.article.findUniqueOrThrow({
    where: {
      id: articleId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  });
  const { likes: _likes, _count, ...filteredArticle } = article;
  const result = {
    likeCount: article._count.likes,
    isLike: userId ? article.likes.length === 1 : false,
    ...filteredArticle,
  };
  return result;
}

async function patchArticleService({ articleId, userId, data }: PatchArticle) {
  if (await authorization({ userId, articleId })) {
    const article = await prisma.article.update({
      where: { id: articleId },
      data,
    });
    return article;
  } else {
    throw new ForbiddenError('수정 권한이 없습니다.');
  }
}

async function deleteArticleService({ articleId, userId }: ArticleParams) {
  if (await authorization({ userId, articleId })) {
    const article = await prisma.article.delete({
      where: { id: articleId },
    });
    return article;
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}
async function postArticleLikeService({ userId, articleId }: ArticleParams) {
  const article = await prisma.articleLike.create({
    data: {
      userId,
      articleId,
    },
    select: {
      article: true,
    },
  });
  return article;
}
async function deleteArticleLikeService({ userId, articleId }: ArticleParams) {
  const article = await prisma.articleLike.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
    select: {
      article: true,
    },
  });
  return article;
}

export {
  getArticleListService,
  postArticleService,
  getArticleService,
  patchArticleService,
  deleteArticleService,
  postArticleLikeService,
  deleteArticleLikeService,
};
