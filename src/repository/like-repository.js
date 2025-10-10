export class LikeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 상품 좋아요 찾기
  findProductLike = async (userId, productId) => {
    return await this.prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  };

  // 상품 좋아요 생성
  createProductLike = async (userId, productId) => {
    return await this.prisma.productLike.create({
      data: { userId, productId },
    });
  };

  // 상품 좋아요 삭제
  deleteProductLike = async (userId, productId) => {
    return await this.prisma.productLike.delete({
      where: { userId_productId: { userId, productId } },
    });
  };

  findArticleLike = async (userId, articleId) => {
    return await this.prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  };

  createArticleLike = async (userId, articleId) => {
    return await this.prisma.articleLike.create({
      data: { userId, articleId },
    });
  };

  deleteArticleLike = async (userId, articleId) => {
    return await this.prisma.articleLike.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  };
}
