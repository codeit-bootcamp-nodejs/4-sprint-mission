import express from "express";
import { validateArticle } from "../middleware/index.js";
import auth from "../middleware/auth.js";
import * as articleController from "../controller/articleController.js";

const router = express.Router();

router
  .route("/")

  // Create a post
  .post(
    auth.verifyAccessToken, 
    validateArticle, 
    articleController.createPost
  )

  // Retrieve all articles
  .get(articleController.getPosts);

router
  .route("/:id")

  // Get informations of a specific article
  .get(articleController.getPost)

  // Modify a article property
  .patch(
    auth.verifyAccessToken,
    auth.verifyArticleAuth,
    articleController.patchPost
  )

  // Delete a particular article
  .delete(
    auth.verifyAccessToken,
    auth.verifyArticleAuth,
    articleController.deletePost
  );

router
  .route("/:id/comments")

  // Add a comment
  .post(
    auth.verifyAccessToken,
    auth.checkArticleExist,
    articleController.postComment
  )

  // Inquery all comments
  .get(auth.checkArticleExist, articleController.getComments);

router
  .route("/:id/comments/:cid")

  // Modify comment
  .patch(
    auth.verifyAccessToken,
    auth.checkArticleExist,
    auth.verifyArticleCommentAuth,
    articleController.patchComment
  )

  // Delete comment
  .delete(
    auth.verifyAccessToken,
    auth.checkArticleExist,
    auth.verifyArticleCommentAuth,
    articleController.deleteComment
  );

export default router;
