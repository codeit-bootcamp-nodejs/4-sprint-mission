import express from "express";
import ArticleController from "../controllers/article.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { validateDto, validateParams } from "../middlewares/validator.js";
import { ArticleDto } from "../services/article/article.dto.js";
import { ArticleIdParamDto } from "../services/article/article-param.dto.js";

const router = express.Router();

router.post("/", authenticate, validateDto(ArticleDto), ArticleController.createArticle);
router.get("/:id", validateParams(ArticleIdParamDto), ArticleController.findUniqueArticle);
router.patch(
  "/:id",
  authenticate,
  validateParams(ArticleIdParamDto),
  validateDto(ArticleDto),
  ArticleController.updateArticle
);
router.delete("/:id", authenticate, validateParams(ArticleIdParamDto), ArticleController.deleteArticle);
router.get("/", ArticleController.findManyArticle);

export default router;
