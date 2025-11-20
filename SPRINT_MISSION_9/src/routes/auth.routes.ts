import { Router } from "express";

const router = Router();

// 회원가입
router.post("/signup", (req, res) => {
  return res.status(201).json({ message: "Signup ok" });
});

// 로그인
router.post("/login", (req, res) => {
  return res.json({ token: "fake-jwt-token" });
});

export default router;
