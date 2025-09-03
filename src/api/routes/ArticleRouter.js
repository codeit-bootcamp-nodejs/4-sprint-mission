import express from "express";
import ArticleController from "../controllers/ArticleController.js";
import validateArticle from "../middlewares/validators/validateArticle.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateArticle,
  ArticleController.createArticle
);
router.get("/:id", ArticleController.findUniqueArticle);
router.patch(
  "/:id",
  authenticate,
  validateArticle,
  ArticleController.updateArticle
);
router.delete("/:id", authenticate, ArticleController.deleteArticle);
router.get("/", ArticleController.findManyArticle);

export default router;
