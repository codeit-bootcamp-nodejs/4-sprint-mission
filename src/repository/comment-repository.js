export class CommentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * 새로운 댓글을 생성
   * @param {string} content - 댓글 내용
   * @param {number|undefined} productId - 연결될 상품 ID
   * @param {number|undefined} articleId - 연결될 게시글 ID
   * @returns {Promise<object>} 생성된 댓글 객체
   */
  createComment = async (content, productId, articleId) => {
    return await this.prisma.comment.create({
      data: {
        content,
        productId: productId ? parseInt(productId) : undefined,
        articleId: articleId ? parseInt(articleId) : undefined,
      },
    });
  };

  /**
   * 특정 상품 또는 게시글의 댓글 목록을 조회
   * @param {object} where - Prisma 조회 조건
   * @param {number} limit - 페이지당 아이템 수
   * @param {number|undefined} cursor - 커서 ID
   * @returns {Promise<Array<object>>} 댓글 목록
   */
  findManyComments = async (where, limit, cursor) => {
    return await this.prisma.comment.findMany({
      where,
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });
  };

  /**
   * ID로 특정 댓글을 조회
   * @param {number} commentId - 댓글 ID
   * @returns {Promise<object|null>} 조회된 댓글 객체
   */
  findCommentById = async (commentId) => {
    return await this.prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
  };

  /**
   * 특정 댓글의 내용을 수정
   * @param {number} commentId - 댓글 ID
   * @param {string} content - 수정할 내용
   * @returns {Promise<object>} 수정된 댓글 객체
   */
  updateComment = async (commentId, content) => {
    return await this.prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
  };

  /**
   * 특정 댓글을 삭제
   * @param {number} commentId - 댓글 ID
   * @returns {Promise<void>}
   */
  deleteComment = async (commentId) => {
    await this.prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
  };
}
