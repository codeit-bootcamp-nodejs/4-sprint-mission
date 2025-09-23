import express from "express";
import authenticate from "../middlewares/authenticate.js";
import MypageController from "../controllers/mypage.controller.js";
import { validateDto } from "../middlewares/validator.js";
import { UpdateUserDto, UpdatePasswordDto } from "../services/mypage/mypage.dto.js";

const router = express.Router();

router.get("/", authenticate, MypageController.getUser);
router.patch("/", authenticate, validateDto(UpdateUserDto), MypageController.updateUser);
router.patch("/password", authenticate, validateDto(UpdatePasswordDto), MypageController.updatePassword);
router.delete("/", authenticate, MypageController.deleteUser);
router.get("/products", authenticate, MypageController.getProducts);
router.get("/like-products", authenticate, MypageController.getLikeProducts);

export default router;
