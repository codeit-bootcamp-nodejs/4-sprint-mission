export class LikeService {
  constructor(likeRepository, productRepository, articleRepository) {
    this.likeRepository = likeRepository;
    this.productRepository = productRepository;
    this.articleRepository = articleRepository;
  }

  // 상품 좋아요 토글
  toggleProductLike = async (userId, productId) => {
    // 상품 존재 여부 확인
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await this.likeRepository.findProductLike(
      userId,
      productId,
    );

    if (existingLike) {
      // 좋아요가 있다면 -> 삭제 (좋아요 취소)
      await this.likeRepository.deleteProductLike(userId, productId);
      return { message: '좋아요가 취소되었습니다.' };
    } else {
      // 좋아요가 없다면 -> 생성 (좋아요 누르기)
      await this.likeRepository.createProductLike(userId, productId);
      return { message: '좋아요를 눌렀습니다.' };
    }
  };

  // 게시글 좋아요
  toggleArticleLike = async (userId, articleId) => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    const existingLike = await this.likeRepository.findArticleLike(
      userId,
      articleId,
    );

    if (existingLike) {
      await this.likeRepository.deleteArticleLike(userId, articleId);
      return { message: '게시글 좋아요가 취소되었습니다.' };
    } else {
      await this.likeRepository.createArticleLike(userId, articleId);
      return { message: '게시글을 좋아했습니다.' };
    }
  };
}
