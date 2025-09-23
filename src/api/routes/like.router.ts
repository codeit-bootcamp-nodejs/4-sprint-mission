import express from "express";
import authenticate from "../middlewares/authenticate.js";
import LikeController from "../controllers/like.controller.js";
import { validateParams } from "../middlewares/validator.js";
import { ToggleLikeParamDto } from "../services/like/like.dto.js";

const router = express.Router();

router.post("/:type/:id", authenticate, validateParams(ToggleLikeParamDto), LikeController.toggleLike);

export default router;
