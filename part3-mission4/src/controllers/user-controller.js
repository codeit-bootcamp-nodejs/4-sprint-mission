import { userService } from '../services/user-service.js';

class UserController {
  async register(req, res) {
    const { username, email, password } = req.body;
    const user = await userService.register(username, email, password);
    res.status(201).json({
      data: user,
      message: '회원 가입 성공!',
    });
  }

  async login(req, res) {
    const { accessToken, refreshToken } = await userService.login(req.user.id);
    userService.setTokenCookies(res, accessToken, refreshToken);
    res.status(200).json({ token: accessToken, message: '로그인 되었습니다.' });
  }

  logout(req, res) {
    userService.clearTokenCookies(res);
    res.status(200).send({ message: '로그아웃 되었습니다.' });
  }
}

export const userController = new UserController();
