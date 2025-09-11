import type { CustomError } from "../types/error.js";
import type { CreateCommentData, UpdateCommentData, FindManyCommentParams } from "../types/comment.js";
import * as CommentRepository from "../repositories/CommentRepository.js";

const CommentService = {
  async createComment({ content, productId, articleId, userId }: CreateCommentData) {
    const newComment = await CommentRepository.create({
      content,
      ...(productId && { product: { connect: { id: productId } } }),
      ...(articleId && { article: { connect: { id: articleId } } }),
      user: { connect: { id: userId } },
    });
    return newComment;
  },

  async updateComment(id: number, updateData: UpdateCommentData, userId: number) {
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

  async findManyComment(params: FindManyCommentParams) {
    const comments = await CommentRepository.findMany(params);
    return comments;
  },
};

export default CommentService;
