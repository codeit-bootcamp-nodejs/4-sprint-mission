import express from "express";
import {
  modifyArticle,
  createArticle,
  getArticlesById,
  getArticles,
  removeArticle,
} from "./article.controller.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.js";
import {
  paginationSchema,
  sortSchema,
  articleIdSchema,
  modifyArticleSchema,
} from "./article.validate.schema.js";


const router = express.Router();

router.get("/", validateQuery(paginationSchema, sortSchema), getArticles);

router.get("/:id", validateParams(articleIdSchema), getArticlesById);

router.post("/", createArticle);

router.delete("/:id", validateParams(articleIdSchema), removeArticle);

router.patch("/:id", validateBody(modifyArticleSchema), modifyArticle);

export default router;
