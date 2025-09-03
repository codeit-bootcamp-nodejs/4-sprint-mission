import express from "express";
import { getArticleController } from "../controllers/article/get_article_controller.js";
import { getArticleByIdController } from "../controllers/article/get_article_by_id_controller.js";
import { createArticleController } from "../controllers/article/create_article_controller.js";
import { updateArticleController } from "../controllers/article/update_article_controller.js";
import { deleteArticleController } from "../controllers/article/delete_article_controller.js";

const router = express.Router();

router.route("/").get(getArticleController).post(createArticleController);

router
  .route("/:id")
  .get(getArticleByIdController)
  .patch(updateArticleController)
  .delete(deleteArticleController);

export default router;
