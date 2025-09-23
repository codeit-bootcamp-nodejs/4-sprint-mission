import type { CreateArticleResponseDto } from './create-articles-response.dto.js';

export const createArticleSerializer = (data: {
  id: number;
  authorId: number;
  title: string;
  content: string;
}): CreateArticleResponseDto => {
  const { id, authorId, title, content } = data;
  return { id, authorId, title, content };
};
