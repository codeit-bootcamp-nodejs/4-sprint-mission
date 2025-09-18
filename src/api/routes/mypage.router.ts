import express from "express";
import authenticate from "../middlewares/authenticate.js";
import MypageController from "../controllers/mypage.controller.js";
import validate from "../middlewares/validate.js";
import { updateUserSchema, updatePasswordSchema } from "../types/dtos/mypage.dto.js";

const router = express.Router();

router.get("/", authenticate, MypageController.getUser);
router.patch("/", authenticate, validate(updateUserSchema), MypageController.updateUser);
router.patch("/password", authenticate, validate(updatePasswordSchema), MypageController.updatePassword);
router.delete("/", authenticate, MypageController.deleteUser);
router.get("/products", authenticate, MypageController.getProducts);
router.get("/like-products", authenticate, MypageController.getLikeProducts);

export default router;
