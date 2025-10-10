export class CommentService {
  constructor(commentRepository, prisma) {
    this.commentRepository = commentRepository;
    this.prisma = prisma;
  }

  // 댓글 생성
  createComment = async (userId, content, productId, articleId) => {
    return await this.commentRepository.createComment(
      userId,
      content,
      productId,
      articleId,
    );
  };

  // 댓글 목록 조회
  getComments = async (productId, articleId, limit, cursor) => {
    const where = {
      productId: productId ? parseInt(productId) : undefined,
      articleId: articleId ? parseInt(articleId) : undefined,
    };

    const comments = await this.commentRepository.findManyComments(
      where,
      limit,
      cursor,
    );

    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].id : null;

    return { data: comments, nextCursor };
  };

  // 댓글 수정
  updateComment = async (userId, commentId, content) => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new Error('댓글을 수정할 권한이 없습니다.');
    }
    return await this.commentRepository.updateComment(commentId, content);
  };

  // 댓글 삭제
  deleteComment = async (userId, commentId) => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new Error('댓글을 삭제할 권한이 없습니다.');
    }
    await this.commentRepository.deleteComment(commentId);
  };

  // 댓글 상세 조회
  getCommentById = async (commentId) => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    return comment;
  };
}
