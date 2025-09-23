import prisma from '@config/prisma.js';
import { AppError } from '../../../utils/app-error.js';
import type { UpdateArticleDto } from './update-articles.dto.js';

export const updateArticleService = async (input: UpdateArticleDto) => {
  const article = await prisma.article.findUnique({
    where: { id: input.articleId },
  });

  if (!article) throw new AppError('Article not found', 404);
  if (article.authorId !== input.userId) throw new AppError('Forbidden', 403);

  return prisma.article.update({
    where: { id: input.articleId },
    data: { title: input.title, content: input.content },
  });
};
