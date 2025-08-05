import express from "express";
import ArticleController from "../controllers/ArticleController.js";

const router = express.Router();

router.post("/", ArticleController.createArticle);
router.get("/:id", ArticleController.findUniqueArticle);
router.patch("/:id", ArticleController.updateArticle);
router.delete("/:id", ArticleController.deleteArticle);
router.get("/", ArticleController.findManyArticle);

export default router;
