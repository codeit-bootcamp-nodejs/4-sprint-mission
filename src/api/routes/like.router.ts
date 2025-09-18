import express from "express";
import authenticate from "../middlewares/authenticate.js";
import LikeController from "../controllers/like.controller.js";

const router = express.Router();

router.post("/:type/:id", authenticate, LikeController.toggleLike);

export default router;
