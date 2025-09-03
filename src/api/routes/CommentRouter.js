import express from "express";
import CommentController from "../controllers/CommentController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, CommentController.createComment);
router.patch("/:id", authenticate, CommentController.updateComment);
router.delete("/:id", authenticate, CommentController.deleteComment);
router.get("/", CommentController.findManyComment);

export default router;
