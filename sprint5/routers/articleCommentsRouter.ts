import express from "express";
import { aritcleCommentsController } from "../controllers/articleCommentsController";
import {
  validateNewComment,
  validateCommentUpdate,
  validateId,
} from "../middlewares/validate";
import passport from "../lib/passport/index";

const articleCommentRouter = express.Router({ mergeParams: true });

articleCommentRouter
  .route("/")
  .get(aritcleCommentsController.getArticleComments)
  .post(
    validateNewComment,
    passport.authenticate("access-token", { session: false }),
    aritcleCommentsController.createArticleComment
  );

articleCommentRouter
  .route("/:commentId")
  .patch(
    validateCommentUpdate,
    passport.authenticate("access-token", { session: false }),
    aritcleCommentsController.updateArticleComment
  )
  .delete(
    validateId,
    passport.authenticate("access-token", { session: false }),
    aritcleCommentsController.deleteArticleComment
  );

export default articleCommentRouter;
