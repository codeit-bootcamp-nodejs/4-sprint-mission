import express from "express";
import passport from "../lib/passport";
import { ArticleController } from "../controllers/articleController";

const router = express.Router();
const controller = new ArticleController();

router.post("/", passport.authenticate("access-token", { session: false }), controller.create);
router.patch("/:id", passport.authenticate("access-token", { session: false }), controller.update);
router.delete("/:id", passport.authenticate("access-token", { session: false }), controller.delete);

router.get("/", controller.list);
router.get("/:id", controller.detail);

export default router;
