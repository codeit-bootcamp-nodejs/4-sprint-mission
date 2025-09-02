import express from "express";
import AuthController from "../controllers/AuthController.js";
import hassingPassword from "../middlewares/hashing.js";

const router = express.Router();

router.post("/register", hassingPassword(), AuthController.signup);
router.post("/login", AuthController.login); // 나중에 user 유효성 검사 추가

export default router;
