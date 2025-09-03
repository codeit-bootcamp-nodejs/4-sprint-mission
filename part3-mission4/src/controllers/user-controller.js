import { userService } from '../services/user-service';

class UserController {
  async register(req, res) {
    const { username, email, password } = req.body;
    const user = await userService.register(username, email, password);
    res.status(201).json({
      data: user,
      message: '회원 가입 성공!',
    });
  }
}

export const userController = new UserController();
