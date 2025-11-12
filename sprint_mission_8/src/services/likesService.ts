import * as likesRepository from '../repositories/likesRepository';
import * as articlesRepository from '../repositories/articlesRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import BadRequestError from '../lib/errors/BadRequestError';

export async function createLike(articleId: number, userId: number) {
  const existingArticle = await articlesRepository.getArticle(articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await likesRepository.getLike(articleId, userId);
  if (existingLike) {
    throw new BadRequestError('Already liked');
  }

  await likesRepository.createLike({ articleId, userId });
}

export async function deleteLike(articleId: number, userId: number) {
  const existingArticle = await articlesRepository.getArticle(articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await likesRepository.getLike(articleId, userId);
  if (!existingLike) {
    throw new BadRequestError('Not liked');
  }

  await likesRepository.deleteLike(existingLike.id);
}
