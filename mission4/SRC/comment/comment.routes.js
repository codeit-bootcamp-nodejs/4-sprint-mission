import express from "express";
import { CommentController } from "./comment.controller.js";
import { isAuthenticated } from "../middle_ware/auth.middleWare.js";
import { isCommentOwner } from "../middle_ware/authorization.js";
import passport from "passport"
const router = express.Router();
const cc = new CommentController();

router.get("/", (req, res) => cc.getCommentListController(req, res));
router.get("/:id", (req, res) => cc.getCommentController(req, res));
router.post("/", isAuthenticated, (req, res) =>
  cc.createCommentController(req, res)
);
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  isCommentOwner,
  (req, res) => cc.patchCommentController(req, res)
);
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  isCommentOwner,
  (req, res) => cc.deleteCommentController(req, res)
);
export default router;
