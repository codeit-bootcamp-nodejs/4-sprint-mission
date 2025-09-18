import express from "express";
import CommentController from "../controllers/comment.controller.js";
import authenticate from "../middlewares/authenticate.js";
import validate from "../middlewares/validate.js";
import { commentSchema } from "../types/dtos/comment.dto.js";

const router = express.Router();

router.post("/", authenticate, validate(commentSchema), CommentController.createComment);
router.patch("/:id", authenticate, validate(commentSchema), CommentController.updateComment);
router.delete("/:id", authenticate, CommentController.deleteComment);
router.get("/", CommentController.findManyComment);

export default router;
