import express from "express";
import ArticleController from "../controllers/ArticleController.js";
import authenticate from "../middlewares/authenticate.js";
import validate from "../middlewares/validators/validate.js";
import { ArticleSchema } from "../middlewares/validators/validateArticle.js";

const router = express.Router();

router.post("/", authenticate, validate(ArticleSchema), ArticleController.createArticle);
router.get("/:id", ArticleController.findUniqueArticle);
router.patch("/:id", authenticate, validate(ArticleSchema), ArticleController.updateArticle);
router.delete("/:id", authenticate, ArticleController.deleteArticle);
router.get("/", ArticleController.findManyArticle);

export default router;
