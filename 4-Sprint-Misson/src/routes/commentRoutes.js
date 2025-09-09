import express from "express";
import { CommentsController } from "../controllers/commentsController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();
const controller = new CommentsController();

// 등록- 로그인 필요
router.post("/product/:productId", authenticate, controller.createForProduct.bind(controller));
router.post("/article/:articleId", authenticate, controller.createForArticle.bind(controller));

// 수정/삭제 - 작성한 사람만 가능
router.patch("/:id", authenticate, controller.update.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

// 조회 - 인증 X
router.get("/product/:productId", controller.listForProduct.bind(controller));
router.get("/article/:articleId", controller.listForArticle.bind(controller));

export default router;
