import express from "express";
import passport from "../lib/passport";
import { LikeController } from "../controllers/likeController";

const router = express.Router();
const controller = new LikeController();

router.post("/articles/:id", passport.authenticate("access-token", { session: false }), controller.likeArticle);
router.post("/products/:id", passport.authenticate("access-token", { session: false }), controller.likeProduct);
router.get("/articles", passport.authenticate("access-token", { session: false }), controller.getLikedArticles);
router.get("/products", passport.authenticate("access-token", { session: false }), controller.getLikedProducts);

export default router;