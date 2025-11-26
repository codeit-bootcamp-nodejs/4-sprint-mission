import express from "express";
import passport from "../lib/passport";
import { ProductController } from "../controllers/productController";

const router = express.Router();
const controller = new ProductController();

// ✅ 인증 필요
router.post("/", passport.authenticate("access-token", { session: false }), controller.create);
router.patch("/:id", passport.authenticate("access-token", { session: false }), controller.update);
router.delete("/:id", passport.authenticate("access-token", { session: false }), controller.delete);

// ✅ 인증 필요 X (공개)
router.get("/", controller.list);
router.get("/:id", controller.detail);

export default router;
