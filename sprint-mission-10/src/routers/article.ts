import express from "express";
import * as articleValidation from "../schemas/article";
import * as commentValidation from "../schemas/comment";
import upload from "../middlewares/multer";
import API from "../controllers/articles/index";
import passports from "../lib/passport/index";

const router = express.Router();
const auth = passports.jwtAccess;

router.post(
  "/",
  auth,
  articleValidation.create,
  upload.single("Image"),
  API.createArticle
);

router.post(
  "/comments/:id",
  auth,
  commentValidation.create,
  API.createArticleComment
);

router.get("/detail/:id", API.getArticleDetail);

router.get("/list", API.getArticleList);

router.get("/comments/:id", API.getArticleComment);

router.patch("/:id", auth, articleValidation.update, API.updateArticle);

router.patch(
  "/comments/:id",
  auth,
  commentValidation.create,
  API.updateArticleComment
);

router.delete("/:id", auth, API.deleteArticle);

router.delete("/comments/:id", auth, API.deleteArticleComment);

export default router;
