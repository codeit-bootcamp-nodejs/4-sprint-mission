import * as articleRepository from '../repositories/articleRepository';

export async function createArticle(data: {
  title: string;
  content: string;
  userId: number;
}) {
  return articleRepository.createArticle(data);
}

export async function getArticles(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) {
  return articleRepository.getArticles(params);
}

export async function getArticleById(id: number) {
  const article = await articleRepository.getArticleById(id);
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
}

export async function updateArticle(
  id: number,
  userId: number,
  data: {
    title?: string;
    content?: string;
  }
) {
  const article = await articleRepository.getArticleById(id);
  if (!article) {
    throw new Error('Article not found');
  }
  if (article.userId !== userId) {
    throw new Error('You are not authorized to update this article');
  }

  return articleRepository.updateArticle(id, data);
}

export async function deleteArticle(id: number, userId: number) {
  const article = await articleRepository.getArticleById(id);
  if (!article) {
    throw new Error('Article not found');
  }
  if (article.userId !== userId) {
    throw new Error('You are not authorized to delete this article');
  }

  return articleRepository.deleteArticle(id);
}
