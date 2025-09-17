import express from "express";
import userService from "../services/userService.js";

const userController = express.Router();
//-------------------- 회원가입 API를 만들어 주세요.-------------------------------------
//- email, nickname, password 를 입력하여 회원가입을 진행합니다.

userController.post("/users", async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      return res
        .status(400)
        .json({ error: "이메일, 닉네임, 비밀번호는 필수 입력 항목입니다." });
    }

    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

//------------------------------------------------------------------------
userController.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});


// 토큰 기반 인증: 로그인에 성공하면 Access Token을 발급하는 기능을 구현합니다.

//회원가입 API
export default userController;
