import express from "express";

import authenticate from "../middleware/authenticate.js";

import { getUserController } from "../controllers/user/get_user_controller.js";
import { getUserByIdController } from "../controllers/user/get_user_by_id_controller.js";
import { updateUserController } from "../controllers/user/update_user_controller.js";

const router = express.Router();

router.route("/").get(getUserController);
router
  .route("/:id")
  .get(authenticate, getUserByIdController)
  .patch(authenticate, updateUserController);

export default router;
