import prisma from '@config/prisma.js';
import { ForbiddenError, NotFoundError } from '@utils/app-error.js';

export const deleteArticleService = async ({
  articleId,
  userId,
}: {
  articleId: number;
  userId: number;
}) => {
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article) throw new NotFoundError('Article not found');
  if (article.authorId !== userId) throw new ForbiddenError();

  await prisma.article.delete({ where: { id: articleId } });
};
