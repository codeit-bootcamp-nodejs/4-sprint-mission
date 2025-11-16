// src/modules/comments/comment.repository.ts
import prisma from "../lib/prismaClient";

export const commentRepository = {
  // ✅ 댓글 저장
  async createComment(userId: number, postId: number, content: string) {
    return await prisma.comment.create({
      data: {
        userId,
        articleId: postId, // ✅ articleId로 연결
        content,
      },
    });
  },

  // ✅ 게시글 작성자 조회
  async findAllByUserId(postId: number) {
    return await prisma.article.findUnique({
      where: { id: postId },
      select: { id: true, title: true, userId: true },
    });
  },
};
