import express from "express";
import CommentController from "../controllers/comment.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { validateDto, validateParams } from "../middlewares/validator.js";
import { CreateCommentDto, UpdateCommentDto } from "../services/comment/comment.dto.js";
import { CommentIdParamDto } from "../services/comment/comment-param.dto.js";

const router = express.Router();

router.post("/", authenticate, validateDto(CreateCommentDto), CommentController.createComment);
router.patch(
  "/:id",
  authenticate,
  validateParams(CommentIdParamDto),
  validateDto(UpdateCommentDto),
  CommentController.updateComment
);
router.delete("/:id", authenticate, validateParams(CommentIdParamDto), CommentController.deleteComment);
router.get("/", CommentController.findManyComment);

export default router;
