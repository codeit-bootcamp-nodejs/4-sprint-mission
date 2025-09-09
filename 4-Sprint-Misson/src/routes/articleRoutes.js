import express from "express";
import { ArticlesController } from "../controllers/articlesController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();
const controller = new ArticlesController();

//인증
router.post("/", authenticate, controller.create.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

//인증 없음
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.getById.bind(controller));

export default router;