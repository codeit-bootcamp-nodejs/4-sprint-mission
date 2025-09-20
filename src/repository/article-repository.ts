export class ArticleRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * 새로운 게시글을 생성합
   * @param {string} title - 게시글 제목
   * @param {string} content - 게시글 내용
   * @returns {Promise<object>} 생성된 게시글 객체
   */
  createArticle = async (userId, title, content) => {
    return await this.prisma.article.create({
      data: { userId, title, content },
    });
  };

  /**
   * 조건에 맞는 게시글 목록을 조회.
   * @param {object} whereCondition - Prisma 조회 조건
   * @param {number} offset - 페이지네이션 offset
   * @param {number} limit - 페이지당 아이템 수
   * @param {object} [tx] - (선택) 트랜잭션용 Prisma 클라이언트
   * @returns {Promise<Array<object>>} 게시글 목록
   */
  findManyArticles = async (whereCondition, offset, limit, userId, tx) => {
    const prismaClient = tx || this.prisma;
    const articles = await prismaClient.article.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    if (userId && articles.length > 0) {
      const articleIds = articles.map((a) => a.id);

      const likes = await this.prisma.articleLike.findMany({
        where: {
          userId: userId,
          articleId: { in: articleIds },
        },
        select: {
          articleId: true,
        },
      });

      const likedArticleIds = new Set(likes.map((like) => like.articleId));

      articles.forEach((article) => {
        article.isLiked = likedArticleIds.has(article.id);
      });
    }

    return articles;
  };

  /**
   * 조건에 맞는 게시글의 전체 개수를 조회
   * @param {object} whereCondition - Prisma 조회 조건
   * @param {object} [tx] - (선택) 트랜잭션용 Prisma 클라이언트
   * @returns {Promise<number>} 게시글 전체 개수
   */
  countArticles = async (whereCondition, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.article.count({ where: whereCondition });
  };

  /**
   * ID로 특정 게시글을 조회
   * @param {number} articleId - 게시글 ID
   * @returns {Promise<object|null>} 조회된 게시글 객체
   */
  findArticleById = async (articleId, userId) => {
    const article = await this.prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: {
        _count: { select: { likes: true } },
      },
    });

    if (article && userId) {
      const like = await this.prisma.articleLike.findUnique({
        where: { userId_articleId: { userId, articleId: parseInt(articleId) } },
      });
      article.isLiked = !!like;
    }
    return article;
  };

  /**
   * 특정 게시글의 정보를 수정
   * @param {number} articleId - 게시글 ID
   * @param {object} dataToUpdate - 수정할 데이터
   * @returns {Promise<object>} 수정된 게시글 객체
   */
  updateArticle = async (articleId, dataToUpdate) => {
    return await this.prisma.article.update({
      where: { id: parseInt(articleId) },
      data: dataToUpdate,
    });
  };

  /**
   * 특정 게시글을 삭제합
   * @param {number} articleId - 게시글 ID
   * @returns {Promise<void>}
   */
  deleteArticle = async (articleId) => {
    await this.prisma.article.delete({
      where: { id: parseInt(articleId) },
    });
  };
}
