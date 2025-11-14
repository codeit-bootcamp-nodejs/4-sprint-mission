import express from "express";
import passport from "../lib/passport";
import { CommentController } from "../controllers/commentController";

const router = express.Router();
const controller = new CommentController();

// Private
router.post("/products/:id", passport.authenticate("access-token", { session: false }), controller.createProductComment);
router.post("/articles/:id", passport.authenticate("access-token", { session: false }), controller.createArticleComment);
router.patch("/:id", passport.authenticate("access-token", { session: false }), controller.modifyComment);
router.delete("/:id", passport.authenticate("access-token", { session: false }), controller.deleteComment);

// Public
router.get("/products/:id", controller.productCommentList);
router.get("/articles/:id", controller.articleCommentList);

export default router;
