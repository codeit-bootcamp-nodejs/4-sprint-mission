export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  // 댓글 생성
  createComment = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { content } = req.body;
      const { productId, articleId } = req.params;
      const newComment = await this.commentService.createComment(
        userId,
        content,
        productId,
        articleId,
      );
      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  };

  // 댓글 목록 조회
  getComments = async (req, res, next) => {
    try {
      const { productId, articleId } = req.params;
      const limit = parseInt(req.query.limit || '10');
      const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;

      const comments = await this.commentService.getComments(
        productId,
        articleId,
        limit,
        cursor,
      );
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  // 댓글 수정
  updateComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const updatedComment = await this.commentService.updateComment(
        commentId,
        content,
      );
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      await this.commentService.deleteComment(commentId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
