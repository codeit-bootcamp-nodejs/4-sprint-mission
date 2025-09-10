import prisma from "../libs/prismaClient.js";
import type { LikeData } from "../types/like.js";

const LikeService = {
  async toggleLike(userId: number, type: string, contentId: number) {
    const user: LikeData = { userId };
    if (type === "article") {
      user.articleId = contentId;
    } else {
      user.productId = contentId;
    }

    const existingLike = await prisma.like.findFirst({
      where: user,
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { message: "좋아요가 취소되었습니다.", liked: false };
    } else {
      await prisma.like.create({
        data: user,
      });
      return { message: "좋아요를 눌렀습니다.", liked: true };
    }
  },
};

export default LikeService;
