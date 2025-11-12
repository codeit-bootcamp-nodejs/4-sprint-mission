import express from "express";
import passport from "../lib/passport";
import { ProductController } from "../controllers/productController";

const router = express.Router();
const controller = new ProductController();

router.post("/", passport.authenticate("access-token", { session: false }), controller.create);
router.get("/", controller.list);
router.get("/:id", passport.authenticate("access-token", { session: false }), controller.list);
router.patch("/:id", passport.authenticate("access-token", { session: false }), controller.update);
router.delete("/:id", passport.authenticate("access-token", { session: false }), controller.delete);

export default router;