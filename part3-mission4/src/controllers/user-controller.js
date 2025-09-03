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

  async getUserProfile(req, res) {
    const profile = await userService.getUserProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }
    res.status(200).json({ profile, message: '유저 프로필 조회!' });
  }

  async updateUserProfile(req, res) {
    const { username, password, email, images } = req.body; // 수정할 필드만 뽑음
    const updateData = { username, password, email, images };
    const updated = await userService.updateUserProfile(
      req.user.id,
      updateData
    );
    res.status(200).json({ updated, message: '프로필 수정 완료!' });
  }
}

export const userController = new UserController();
