import express from "express";
import CommentController from "../controllers/CommentController.js";

const router = express.Router();

router.post("/", CommentController.createComment);
router.patch("/:id", CommentController.updateComment);
router.delete("/:id", CommentController.deleteComment);
router.get("/", CommentController.findManyComment);

export default router;
