import prisma from '@config/prisma.js';

// 모든 게시글 조회 (로그인 유저 기준으로 isLiked 표시)

export const getArticlesService = async (userId: number) => {
  const articles = await prisma.article.findMany({
    include: {
      likes: {
        where: { authorId: userId },
      },
      author: true,
    },
  });

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    authorId: article.authorId,
    author: article.author,
    isLiked: article.likes.length > 0,
  }));
};
