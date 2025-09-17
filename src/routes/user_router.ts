import express from "express";

import authenticate from "../middleware/authenticate";

import {
  getUserController,
  getUserByIdController,
  updateUserController,
  getUserLikeController,
} from "../controllers/user_controller";
const router = express.Router();

router.get("/", getUserController);
router
  .route("/:id")
  .get(authenticate, getUserByIdController)
  .patch(authenticate, updateUserController);

router.get("/:id/like", authenticate, getUserLikeController);

export default router;
