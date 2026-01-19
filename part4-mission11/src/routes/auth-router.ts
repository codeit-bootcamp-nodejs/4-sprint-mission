import express from 'express';

import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import { verifyRefreshToken, generateTokens } from '../lib/token.js';
import { userService } from '../services/user-service.js';

const router = express.Router();

// 리프레시 토큰
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) return res.status(401).json({ message: '인증 오류' });

    const { userId } = verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(userId);
    userService.setTokenCookies(res, accessToken, newRefreshToken);
    return res.json({ accessToken });
  } catch (_err) {
    return res.status(401).json({ message: '인증 오류' });
  }
});

export default router;
