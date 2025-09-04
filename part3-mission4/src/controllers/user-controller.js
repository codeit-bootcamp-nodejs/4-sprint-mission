import { commentService } from '../services/comment-service.js';
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
    const { username, email, images } = req.body; // 수정할 필드만 뽑음
    const updateData = { username, email, images };
    const updated = await userService.updateUserProfile(
      req.user.id,
      updateData
    );
    res.status(200).json({ updated, message: '프로필 수정 완료!' });
  }

  async updatePassword(req, res) {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    if (newPassword !== newPasswordConfirm) {
      return res
        .status(400)
        .json({ message: '새 비밀번호가 일치하지 않습니다.' });
    }
    await userService.updatePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
  }

  async getUserComments(req, res) {
    const userId = req.user.id;
    const comments = await commentService.getUserComments(userId);
    res.status(200).json({ comments });
  }
}

export const userController = new UserController();
