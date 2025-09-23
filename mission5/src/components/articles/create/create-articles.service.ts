import prisma from '@config/prisma.js';
import type { CreateArticleDto } from './create-articles.dto.js';

// 게시글 생성 서비스

export const createArticleService = async (input: CreateArticleDto) => {
  return prisma.article.create({
    data: {
      title: input.title,
      content: input.content,
      author: { connect: { id: input.authorId } },
    },
    select: { id: true, title: true, content: true, authorId: true },
  });
};
