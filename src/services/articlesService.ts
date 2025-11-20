import * as articlesRepository from '../repositories/articlesRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import Article from '../types/Article';

type CreateArticleData = Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'isLiked'>;

export async function createArticle(data: CreateArticleData): Promise<Article> {
  const article = await articlesRepository.createArticle(data);
  return {
    ...article,
    likeCount: 0,
    isLiked: false,
  };
}

export async function getArticle(id: number): Promise<Article> {
  const article = await articlesRepository.getArticle(id);
  if (!article) {
    throw new NotFoundError('Article', id);
  }
  return {
    ...article,
    likeCount: 0,
    isLiked: false,
  };
}

export async function updateArticle(id: number, userId: number, data: Partial<CreateArticleData>): Promise<Article> {
  const existingArticle = await articlesRepository.getArticle(id);
  if (!existingArticle) {
    throw new NotFoundError('Article', id);
  }
  if (existingArticle.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the article');
  }
  const article = await articlesRepository.updateArticle(id, data);
  return {
    ...article,
    likeCount: 0,
    isLiked: false,
  };
}

export async function deleteArticle(id: number, userId: number): Promise<void> {
  const existingArticle = await articlesRepository.getArticle(id);
  if (!existingArticle) {
    throw new NotFoundError('Article', id);
  }
  if (existingArticle.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the article');
  }
  await articlesRepository.deleteArticle(id);
}
