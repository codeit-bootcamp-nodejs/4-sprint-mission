import express from 'express';
import passport from '../lib/passport/passport.js';
import authService from '../services/authService.js';

const authRouter = express.Router();

// 회원가입
const register = async(req, res, next) => {
  const { email, nickname, password } = req.body; 
  try{
    const newUser = await authService.register(email, password, nickname);
    res.status(201).json(newUser);
  } catch(error){
    next(error);
  }
}  

//로그인 => 엑세스 토큰은 헤더를 통해, 리프레쉬 토큰은 쿠키를 통해 전달 
const login = async(req, res, next) => {
  try{
    const user = req.user;
    const { accessToken, refreshToken } = await authService.login(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

//토큰 갱신
const reissueAccessToken = async (req, res) => {
  const userId = req.user.id;
  const oldRefreshToken = req.cookie.refreshToken;
  
  try {
    if (!oldRefreshToken) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    } 
    const { accessToken, refreshToken } = await authService.reissueTokens(userId, oldRefreshToken);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

authRouter.post('/register', register);
authRouter.post('/login', passport.authenticate('local', { session: false }), login);
authRouter.post('/refresh',passport.authenticate('refresh-token', { session: false}), reissueAccessToken);

export default authRouter;