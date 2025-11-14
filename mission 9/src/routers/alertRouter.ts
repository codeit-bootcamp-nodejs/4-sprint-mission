import express from "express";
import passport from "../lib/passport";
import { AlertController } from "../controllers/alertController";

const router = express.Router();
const controller = new AlertController();

router.get("/", passport.authenticate("access-token", { session: false }), controller.list);

router.patch("/:id/read", passport.authenticate("access-token", { session: false }), controller.markAsRead);

export default router;
