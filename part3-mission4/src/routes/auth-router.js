import express from 'express';
import { userService } from '../services/user-service.js';
import { verifyRefreshToken, generateTokens } from '../lib/token.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';

const router = express.Router();

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token' });

    const { userId } = verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(userId);

    userService.setTokenCookies(res, accessToken, newRefreshToken);

    return res.json({ accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: '유효하지 않거나 만료된 리프레시 토큰' });
  }
});

export default router;
