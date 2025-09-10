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
}
