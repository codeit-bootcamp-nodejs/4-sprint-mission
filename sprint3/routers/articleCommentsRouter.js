import express from "express";
import {
  deleteArticleComment,
  getArticleComments,
  patchArticleComment,
  postArticleComment,
} from "../controllers/articleCommentsController.js";
import {
  validateNewComment,
  validateCommentUpdate,
  validateId,
} from "../middlewares/validate.js";
import passport from "../lib/passport/index.js";

const articleCommentRouter = express.Router({ mergeParams: true });

articleCommentRouter
  .route("/")
  .get(getArticleComments)
  .post(
    validateNewComment,
    passport.authenticate("access-token", { session: false }),
    postArticleComment
  );

articleCommentRouter
  .route("/:commentId")
  .patch(
    validateCommentUpdate,
    passport.authenticate("access-token", { session: false }),
    patchArticleComment
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    deleteArticleComment
  );

export default articleCommentRouter;
