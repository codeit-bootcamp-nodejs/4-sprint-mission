import { Request, Response, NextFunction } from "express";
import { ParsedQs } from "qs";
import { CommentService } from "../comment/comment.service";
import { ParamsDictionary } from "express-serve-static-core";
import HttpError from "../lib/error";
export interface RequestedValidate extends Request{
  validatedParams?:RequestParams
  validatedQuery?:RequestQuery 
  validatedBody?:RequestBody;
}

export interface RequestParams extends ParamsDictionary {
  id: string;
}
export interface RequestBody {
  title: string;
  content: string;
}

const commentService = new CommentService();
export interface RequestQuery {
  take?: number;
  page?: number;
  type?: string;
  productId?: string;
  articleId?: string;
}

export class CommentController {
  // 전체 댓글 조회 api
  async getComments(params: RequestParams, query:RequestQuery, res: Response, next: NextFunction) {
    try {
      const { take, page, type } = query as any; // 이미 validate 하고 옴
      const skip: number = (page - 1) * take;
      const commentId  = Number(params.id)
      if (skip > 0 || skip > 100)
          throw new HttpError(400, "잘못된 스킵값")
            const result = await commentService.getCommentList({
        skip,
        take,
        type,
        id: commentId
      });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // 특정 댓글 조회 API
  async getCommentCont( params:RequestParams, res: Response, next: NextFunction) {
    try {
      const commentId = params as any;
      const result = await commentService.getComment({ id: commentId });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  //댓글 생성API
  async createCommentCont(body:RequestBody,query:RequestQuery, res: Response, next: NextFunction) {
    try {
      const { title, content } = body as any;
      const { type } = query as any;
      const { productId, articleId } = query as RequestQuery;
   
      const result = await commentService.createComment({
        title,
        content,
        type,
        productId: Number(productId) ,
        articleId: Number(articleId),
      });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  //특정 댓글 수정 API
  async modifyCommentCont(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body as any;
      const commentId = req.params as any;

      const result = await commentService.modifyComment({
        title,
        content,
        commentId,
      });
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  //특정 댓글 삭제 API

  async deleteCommentCont(req: Request, res: Response, next: NextFunction) {
    try {
      const commentId = Number(req.params.id);
      await commentService.deleteComment({ commentId });
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
