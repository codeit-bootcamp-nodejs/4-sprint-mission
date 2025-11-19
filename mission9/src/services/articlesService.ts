import * as articlesRepository from '../repositories/articlesRepository';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import Article from '../types/Article';

type CreateArticleData = Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isLiked'>;
type UpdateArticleData = Partial<CreateArticleData> & { userId: number };

export async function createArticle(data: CreateArticleData): Promise<Article> {
  const createdArticle = await articlesRepository.createArticle(data);
  return {
    ...createdArticle,
    likeCount: 0,
    isLiked: false,
  };
}

export async function getArticle(id: number): Promise<Article | null> {
  const article = await articlesRepository.getArticleWithLkes(id);
  if (!article) {
    throw new NotFoundError('article', id);
  }
  return article;
}

export async function getArticleList(
  params: PagePaginationParams,
): Promise<PagePaginationResult<Article>> {
  const articles = await articlesRepository.getArticleListWithLikes(params);
  return articles;
}

export async function updateArticle(id: number, data: UpdateArticleData): Promise<Article> {
  const existingArticle = await articlesRepository.getArticle(id);
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== data.userId) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  const updatedArticle = await articlesRepository.updateArticleWithLikes(id, data);
  return updatedArticle;
}

export async function deleteArticle(id: number, userId: number): Promise<void> {
  const existingArticle = await articlesRepository.getArticle(id);
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  await articlesRepository.deleteArticle(id);
}
