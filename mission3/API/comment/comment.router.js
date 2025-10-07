import express from "express";
import {
  createdComment,
  deleteComment,
  getComment,
  getCommentList,
  updatedComment,
} from "./comment.controller.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.js";
import {
  commentBodySchema,
  commentParamsSchema,
  commentQuerySchema,
} from "./comment.validation.schema.js";

const router = express.json(); // parsing body

router.get("/", validateQuery(commentQuerySchema), getCommentList);
router.get("/:id", validateParams(commentParamsSchema), getComment);
router.create("/", validateBody(commentBodySchema), createdComment);
router.patch(
  "/:id",
  validateParams(commentParamsSchema),
  validateBody(commentBodySchema),
  updatedComment
);
router.delete("/:id", validateParams(commentParamsSchema), deleteComment);

export default router;
