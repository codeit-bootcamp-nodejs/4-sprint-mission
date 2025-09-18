import type { LikeData } from "../../types/like.js";
import * as LikeRepository from "../../repositories/like.repository.js";
import type { Prisma } from "@prisma/client";

const LikeService = {
  async toggleLike(userId: number, type: string, contentId: number) {
    const user: LikeData = { userId };
    if (type === "article") {
      user.articleId = contentId;
    } else {
      user.productId = contentId;
    }

    const existingLike = await LikeRepository.findFirst(user);

    if (existingLike) {
      await LikeRepository.remove(existingLike.id);
      return { message: "좋아요가 취소되었습니다.", liked: false };
    } else {
      const createData: Prisma.LikeCreateInput = {
        user: { connect: { id: userId } },
        ...(type === "article" && { article: { connect: { id: contentId } } }),
        ...(type === "product" && { product: { connect: { id: contentId } } }),
      };
      await LikeRepository.create(createData);
      return { message: "좋아요를 눌렀습니다.", liked: true };
    }
  },
};

export default LikeService;
