import express from "express";
import ArticleController from "../controllers/ArticleController.js";
import validateArticle from "../middlewares/validateArticle.js";

const router = express.Router();

router.post("/", validateArticle, ArticleController.createArticle);
router.get("/:id", ArticleController.findUniqueArticle);
router.patch("/:id", validateArticle, ArticleController.updateArticle);
router.delete("/:id", ArticleController.deleteArticle);
router.get("/", ArticleController.findManyArticle);

export default router;
