import { ForbiddenError } from '@/lib/errors.js';
import type { ArticleParams, PatchArticle, PostArticle } from '@/types/article.types.js';
import type { GetListParams } from '@/types/shared.type.js';
import prisma from '../lib/prisma.js';
import ArticleRepository from '../repositories/articles.repository.js';

async function authorization({ userId, articleId }: ArticleParams): Promise<boolean> {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
  });
  return article.userId === userId;
}

async function getArticleListService({ keyword, page, pageSize, userId }: GetListParams) {
  const articles = await ArticleRepository.findMany({ keyword, page, pageSize, userId });
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
  const article = await ArticleRepository.create({ userId, title, content });
  return article;
}

async function getArticleService({ articleId, userId }: ArticleParams) {
  const article = await ArticleRepository.findById({ articleId, userId });
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
    const article = await ArticleRepository.update({ articleId, data });
    return article;
  } else {
    throw new ForbiddenError('수정 권한이 없습니다.');
  }
}

async function deleteArticleService({ articleId, userId }: ArticleParams) {
  if (await authorization({ userId, articleId })) {
    const article = await ArticleRepository.delete({ articleId });
    return article;
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}
async function postArticleLikeService({ userId, articleId }: ArticleParams) {
  const article = await ArticleRepository.like({ userId, articleId });
  return article;
}
async function deleteArticleLikeService({ userId, articleId }: ArticleParams) {
  const article = await ArticleRepository.unlike({ userId, articleId });
  return article;
}

export {
  deleteArticleLikeService,
  deleteArticleService,
  getArticleListService,
  getArticleService,
  patchArticleService,
  postArticleLikeService,
  postArticleService,
};
