import express from 'express';
import userService from '../services/authService.js';

import passport from '../lib/passport/passport.js';

const userRouter = express.Router();

// 회원가입
const register = async(req, res, next) => {
  const { email, nickname, password } = req.body; 
  try{
    const newUser = await userService.register(email, password, nickname);
    res.status(201).json(newUser);
  } catch(error){
    next(error);
  }
}  

//로그인 => 엑세스 토큰은 헤더를 통해, 리프레쉬 토큰은 쿠키를 통해 전달 
const login = async(req, res, next) => {
  try{
    const user = req.user;
    const { accessToken, refreshToken } = await userService.login(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({ accessToken });
  
  } catch (error) {
    next(error);
  }
};

userRouter.post('/register', register);
userRouter.post('/login', passport.authenticate('local', { session: false }), login);


export default userRouter;