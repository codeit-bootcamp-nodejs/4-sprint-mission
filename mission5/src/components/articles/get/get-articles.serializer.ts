import type { GetArticlesResponseDto } from './get-articles-response.dto.js';

export const getArticlesSerializer = (articles: GetArticlesResponseDto[]) => {
  return articles.map(
    ({ id, title, content, createdAt, updatedAt, author, isLiked }) => ({
      id,
      title,
      content,
      createdAt,
      updatedAt,
      author,
      isLiked,
    }),
  );
};
