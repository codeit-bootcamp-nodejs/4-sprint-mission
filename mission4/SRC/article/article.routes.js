import express from "express";
import passport from "passport";
import { ArticleController } from "./article.controller.js";
import { isAuthenticated } from "../middle_ware/auth.middleWare.js";
import { isArticleOwner } from "../middle_ware/authorization.js";
const router = express.Router();
const articleController = new ArticleController();
router.get("/", (req, res) => {
  console.log("GET /articles 요청 들어옴");
  articleController.getArticlesListController(req, res);
});
router.get("/:id", (req, res) => {
  console.log("GET /id 요청 들어옴");
  articleController.getArticleController(req, res);
});
router.post("/", isAuthenticated, (req, res) =>
  articleController.createArticleController(req, res)
);
router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  isArticleOwner,
  (req, res) => articleController.patchArticleController(req, res)
);
router.delete(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  isArticleOwner,
  (req, res) => articleController.deleteArticleController(req, res)
);

export default router;
