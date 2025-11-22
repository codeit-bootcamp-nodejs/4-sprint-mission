import { LikeRepository } from "../repository/like-repository.js";
import { ProductRepository } from "../repository/product-repository.js";
import { ArticleRepository } from "../repository/article-repository.js";
import { LikeResponseDto } from "../types/dto.js";

export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private productRepository: ProductRepository,
    private articleRepository: ArticleRepository
  ) {}

  toggleProductLike = async (
    userId: number,
    productId: number
  ): Promise<LikeResponseDto> => {
    const product = await this.productRepository.findProductById(
      String(productId)
    );
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    const existingLike = await this.likeRepository.findProductLike(
      userId,
      productId
    );

    if (existingLike) {
      await this.likeRepository.deleteProductLike(userId, productId);
      return { message: "좋아요가 취소되었습니다." };
    } else {
      await this.likeRepository.createProductLike(userId, productId);
      return { message: "좋아요를 눌렀습니다." };
    }
  };

  toggleArticleLike = async (
    userId: number,
    articleId: number
  ): Promise<LikeResponseDto> => {
    const article = await this.articleRepository.findArticleById(
      String(articleId)
    );
    if (!article) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const existingLike = await this.likeRepository.findArticleLike(
      userId,
      articleId
    );

    if (existingLike) {
      await this.likeRepository.deleteArticleLike(userId, articleId);
      return { message: "게시글 좋아요가 취소되었습니다." };
    } else {
      await this.likeRepository.createArticleLike(userId, articleId);
      return { message: "게시글을 좋아했습니다." };
    }
  };
}
