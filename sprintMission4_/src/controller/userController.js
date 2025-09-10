import express from 'express';
import userService from '../services/userService.js';
import { generateTokens } from '../services/token.js'

const userRouter = express.Router();

// 회원가입
const register = async(req, res) => {
  const { email, nickname, password } = req.body; 
  try{
    const newUser = await userService.register(email, password, nickname);
    res.status(200).json(newUser);
  } catch(error){
    if (error.code) {
      console.error(error)
      return res.status(error.code).json({ message: error.message });
    } else {
    return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}  

//로그인 => 엑세스 토큰은 헤더를 통해, 리프레쉬 토큰은 쿠키를 통해 전달 
const login = async(req, res) => {
  const { email, password } = req.body;
  try{
    const user = await userService.login(email, password);
    const { accessToken, refreshToken } = generateTokens(user.id);
    await userService.updateRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({ accessToken })
  } catch(error){
    if (error.code) {
      console.log(error);
      return res.status(error.code).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

userRouter.post('/register', register);
userRouter.post('/login', login)


export default userRouter;