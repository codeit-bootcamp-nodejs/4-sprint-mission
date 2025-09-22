import { Router } from "express";
import { ArticlesController } from "../controllers/articleController";

const router = Router();
const controller = new ArticlesController();

// 라우터 정의
router.post("/", controller.create.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));
router.get("/", controller.list.bind(controller));

export default router;
