import * as LikeRepository from "../../repositories/like.repository.js";
import * as ArticleRepository from "../../repositories/article.repository.js";
import * as ProductRepository from "../../repositories/product.repository.js";
import type { Prisma } from "@prisma/client";
import type { CustomError } from "../../types/error.js";

const LikeService = {
  async toggleLike(userId: number, type: "article" | "product", contentId: number) {
    if (type === "article") {
      const article = await ArticleRepository.findById(contentId);
      if (!article) {
        const error: CustomError = new Error("존재하지 않는 게시글입니다.");
        error.statusCode = 404;
        throw error;
      }
    } else {
      const product = await ProductRepository.findById(contentId);
      if (!product) {
        const error: CustomError = new Error("존재하지 않는 상품입니다.");
        error.statusCode = 404;
        throw error;
      }
    }

    const where = type === "article" ? { userId, articleId: contentId } : { userId, productId: contentId };
    const existingLike = await LikeRepository.findFirst(where);

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
