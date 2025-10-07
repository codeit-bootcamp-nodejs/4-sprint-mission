import prisma from "../../lib/prisma.js";
import { CommentService } from "./comment.service.js";

export class CommentController {
  constructor() {
    this.typeList = ["MARKET", "ARTICLE"];
    this.CS = new CommentService();
  }

  async getCommentListController(req, res) {
    try {
      // requested query
      const { type, page, take } = req.query;

      // page nation
      const pageNumber = Number(page) || 1;
      const takeNumber = Number(take) || 10;
      const skip = (pageNumber - 1) * takeNumber;

      if (!Number.isInteger(pageNumber) || pageNumber <= 0)
        throw {
          status: 400,
          message: "페이지 번호는 1 이상의 정수여야 합니다",
        };

      if (!Number.isInteger(takeNumber) || takeNumber <= 0)
        throw { status: 400, message: "take 값은 1 이상의 정수여야 합니다" };

      if (!type) throw { status: 400, message: "type 값 필수" };

      if (typeof type !== "string")
        throw { status: 400, message: "type은 문자열이어야 합니다" };

      const upperChar = type.toUpperCase();
      if (!this.typeList.includes(upperChar))
        throw {
          status: 400,
          message: `허용되지 않은 type 값입니다 (${this.typeList.join(", ")})`,
        };

      const commentList = await this.CS.getCommentListService({
        type,
        page,
        take,
        skip,
      });
      res.status(200).json({
        message: "성공적으로 댓글 리스트 조회 성공",
        data: commentList,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  }

  async getCommentController(req, res) {
    try {
      const commentId = Number(req.params.id);
      const uniqueComment = await this.CS.getCommentService({ commentId });
      if (!Number.isInteger(commentId) || commentId <= 0)
        throw { status: 400, message: "댓글 인덱스오류" };
      res.status(200).json({
        message: "성공적으로 댓글을 가지고 왔습니다",
        data: uniqueComment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  }

  async createCommentController(req, res) {
    // TODO=  로그인한 유저만 댓글을 생성/등록 할수있다.
    try {
      const { content, title, articleId, productId } = req.body;
      const { type } = req.query;

      if (!content) throw { status: 400, message: "content값 필수" };
      if (!title) throw { status: 400, message: "title 값 필수" };
      if (!type) throw { status: 400, message: "type 값 필수" };

      if (typeof type !== "string")
        throw { status: 400, message: "type은 문자열이어야 합니다" };

      const upperChar = type.toUpperCase();
      if (!this.typeList.includes(upperChar))
        throw {
          status: 400,
          message: `허용되지 않은 type 값입니다 (${this.typeList.join(", ")})`,
        };

      const newComment = await this.CS.createCommentService({
        content,
        title,
        articleId,
        productId,
      });
      res
        .status(201)
        .json({ message: "성공적으로 댓글 생성하였습니다", data: newComment });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  }

  async patchCommentController(req, res) {
    // TODO :게시글을 등록한 유저만 댓글을 수정 할수 있다

    try {
      const commentId = Number(req.params.id);
      const { content, title } = req.body;

      if (!Number.isInteger(commentId) || commentId <= 0)
        throw { status: 400, message: "댓글 인덱스오류" };

      const updateComment = await this.CS.updatedCommentService({
        commentId,
        content,
        title,
      });

      res.status(200).json({
        message: "성공적으로 댓글을 수정 하였습니다",
        data: updateComment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  }

  async deleteCommentController(req, res) {
    // TODO: 게시글을 등록한 유저만 댓글을 삭제할수 있다
    try {
      const commentId = Number(req.params.id);
      if (!Number.isInteger(commentId) || commentId <= 0)
        throw { status: 400, message: "댓글 인덱스오류" };

      const removed = await this.CS.deleteCommentService(commentId);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  }
}
