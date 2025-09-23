import type { CustomError } from "../../types/error.js";
import * as CommentRepository from "../../repositories/comment.repository.js";
import type { CreateCommentDto, UpdateCommentDto } from "./comment.dto.js";
import type { FindManyCommentsQuery } from "./comment-findmany.dto.js";

const CommentService = {
  async createComment(commentDto: CreateCommentDto, userId: number) {
    const { content, productId, articleId } = commentDto;

    if (productId && articleId) {
      const error: CustomError = new Error("productId와 articleId 중 하나만 제공되어야 합니다.");
      error.statusCode = 400;
      throw error;
    }

    if (!productId && !articleId) {
      const error: CustomError = new Error("productId 또는 articleId는 필수입니다.");
      error.statusCode = 400;
      throw error;
    }

    try {
      const newComment = await CommentRepository.create({
        content,
        ...(productId && { product: { connect: { id: productId } } }),
        ...(articleId && { article: { connect: { id: articleId } } }),
        user: { connect: { id: userId } },
      });
      return newComment;
    } catch (err) {
      if (err.code === "P2003") {
        const target = productId ? "상품" : "게시글";
        const error: CustomError = new Error(`존재하지 않는 ${target}입니다.`);
        error.statusCode = 404;
        throw error;
      }
      throw err;
    }
  },

  async updateComment(id: number, updateData: UpdateCommentDto, userId: number) {
    const comment = await CommentRepository.findById(id);

    if (!comment) {
      const error: CustomError = new Error("존재하지 않는 댓글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (comment.userId != userId) {
      const error: CustomError = new Error("댓글을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await CommentRepository.update(id, updateData);
  },

  async deleteComment(id: number, userId: number) {
    const comment = await CommentRepository.findById(id);

    if (!comment) {
      const error: CustomError = new Error("존재하지 않는 댓글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (comment.userId != userId) {
      const error: CustomError = new Error("댓글을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await CommentRepository.remove(id);
  },

  async findManyComment(params: FindManyCommentsQuery) {
    const comments = await CommentRepository.findMany(params);
    return comments;
  },
};

export default CommentService;
