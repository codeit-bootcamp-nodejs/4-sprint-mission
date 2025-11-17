import type { Request, Response, NextFunction } from "express";
import express from "express";
import {
  validateParam,
  validateBody,
  validateQuery,
} from "../middleWare/validateMiddle.js";
import {
  commentParamSchema,
  commentPatchSchema,
  commentBodySchema,
  commentQuerySchema,
} from "../validation/comment.validation.js";
import passport from "passport";
import { CommentController } from "../controller/comment.controller.js";
import type { Server as HttpServer } from "http";
export default function createCommentRouter(server: HttpServer) {
  const router = express.Router();
  const commentController = new CommentController(server);

  // 댓글 리스트 및 댓글 조회
  router.get(
    "/",
    validateQuery(commentQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await commentController.accessCommentList(req, res, next);
    }
  );

  router.get(
    "/:id",
    validateParam(commentParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await commentController.accessComment(req, res, next);
    }
  );

  // 회원만 댓글 생성/ 수정/ 삭제 가능
  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    validateBody(commentBodySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await commentController.createComment(req, res, next);
    }
  );

  router.patch(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    validateParam(commentParamSchema),
    validateBody(commentPatchSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await commentController.modifyComment(req, res, next);
    }
  );

  router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    validateParam(commentParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await commentController.deleteComment(req, res, next);
    }
  );

  return router;
}
