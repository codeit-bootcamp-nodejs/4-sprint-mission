import express from 'express';
import passport from '../lib/passport/passport.js'
import userService from '../services/userService.js'
import { generateTokens } from '../services/token.js';
import { 
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME
} from '../lib/const.js'

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/auth/refresh', //오직 토큰 갱신 라우트에서만 사용되도록 제한을 둔다. 
  });
}

const AuthRouter = express.Router();



//회원가입
AuthRouter.post('/auth/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    const user = await userService.register(email, password, nickname);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

//로그인 
AuthRouter.post(
  '/auth/login',
  passport.authenticate('local', { session: false }), 
  async(req, res) => {
    if(!req.user){
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try{
       const { accessToken, refreshToken } = generateTokens(req.user.id);
       await userService.updateRefreshToken(req.user.id, refreshToken);
       setTokenCookies(res, accessToken, refreshToken);
       res.status(200).json({ accessToken });
    } catch(error){
      console.error(error);
      res.status(500).json({ message: 'Failed to generate token'});
    }
  }  
)

//리프레쉬 토큰으로 엑세스토큰, 리프레쉬 토큰 재생성하기
AuthRouter.post(
  '/auth/refresh',
  passport.authenticate('refresh-token', { session: false }),
  async (req, res) => {
    // passport.authenticate가 성공하면 req.user에 사용자 정보가 담깁니다.
    // req.user에는 DB에서 가져온 사용자 객체가 담겨있습니다.
    const userId = req.user.id;
    const oldRefreshToken = req.user.refreshToken;

    try {
      if (!oldRefreshToken || oldRefreshToken !== req.cookies[REFRESH_TOKEN_COOKIE_NAME]) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const { accessToken, refreshToken } = token.generateTokens(userId);
      await userService.updateRefreshToken(userId, refreshToken);
      setTokenCookies(res, accessToken, refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to refresh token' });
    }
  }
);
