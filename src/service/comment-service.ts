import { CommentRepository } from "../repository/comment-repository.js";
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentListResponseDto,
} from "../types/dto.js";
import { Comment, Prisma } from "@prisma/client";
import { ArticleRepository } from "../repository/article-repository.js";
import { NotificationService } from "./notification-service.js";

export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private articleRepository: ArticleRepository,
    private notificationService: NotificationService
  ) {}

  createComment = async (
    userId: number,
    commenterNickname: string,
    createCommentDto: CreateCommentDto,
    productId: string | undefined,
    articleId: string | undefined
  ): Promise<Comment> => {
    const { content } = createCommentDto;
    const newComment = await this.commentRepository.createComment(
      userId,
      content,
      productId,
      articleId
    );

    // 게시글 댓글 알림 로직
    if (articleId) {
      // 게시글 정보 조회
      const article = await this.articleRepository.findArticleById(articleId);

      // 게시글이 존재하고, 댓글 작성자와 게시글 작성자가 다를 때 알림 생성
      if (article && article.userId !== userId) {
        const message = `${commenterNickname}님이 '${article.title}' 게시글에 댓글을 남겼습니다.`;
        const link = `/articles/${articleId}`;

        // 2-3. 알림 생성 및 실시간 전송
        await this.notificationService.createAndSendNotification(
          article.userId,
          message,
          "NEW_COMMENT",
          link
        );
      }
    }

    return newComment;
  };

  getComments = async (
    productId: string | undefined,
    articleId: string | undefined,
    limit: number,
    cursor: number | undefined
  ): Promise<CommentListResponseDto> => {
    const where: Prisma.CommentWhereInput = {
      productId: productId ? parseInt(productId) : undefined,
      articleId: articleId ? parseInt(articleId) : undefined,
    };

    const comments = await this.commentRepository.findManyComments(
      where,
      limit,
      cursor
    );

    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].id : null;

    return { data: comments, nextCursor };
  };

  updateComment = async (
    userId: number,
    commentId: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<Comment> => {
    const { content } = updateCommentDto;
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }
    if (comment.userId !== userId) {
      throw new Error("댓글을 수정할 권한이 없습니다.");
    }
    return await this.commentRepository.updateComment(commentId, content);
  };

  deleteComment = async (userId: number, commentId: string): Promise<void> => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }
    if (comment.userId !== userId) {
      throw new Error("댓글을 삭제할 권한이 없습니다.");
    }
    await this.commentRepository.deleteComment(commentId);
  };

  getCommentById = async (commentId: string): Promise<Comment> => {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }
    return comment;
  };
}
