import express from "express";
import authenticate from "../middlewares/authenticate.js";
import MypageController from "../controllers/MypageController.js";
const router = express.Router();

router.get("/", authenticate, MypageController.getUser);
router.patch("/", authenticate, MypageController.updateUser);
router.patch("/password", authenticate, MypageController.updatePassword);
router.get("/products", authenticate, MypageController.getProducts);
router.get("/like-products", authenticate, MypageController.getLikeProducts);

export default router;
