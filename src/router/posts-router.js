import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import optionalAuth from "../middlewares/optional-auth.js";
import {
  createPost, listPosts, getPost, updatePost, deletePost,
  addPostComment, listPostComments, updateComment, deleteComment,
  likePost, unlikePost
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", optionalAuth, listPosts);
router.get("/:postId", optionalAuth, getPost);

router.post("/", authMiddleware, createPost);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);

router.get("/:postId/comments", listPostComments);
router.post("/:postId/comments", authMiddleware, addPostComment);
router.put("/comments/:commentId", authMiddleware, updateComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

router.post("/:postId/like", authMiddleware, likePost);
router.delete("/:postId/like", authMiddleware, unlikePost);

export default router;
