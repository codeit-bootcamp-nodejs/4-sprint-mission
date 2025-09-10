export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;
      const newUser = await this.userService.signUp(email, nickname, password);
      res.status(201).json({ data: newUser });
    } catch (error) {
      next(error);
    }
  };

  // 로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.signIn(email, password);
      res.status(200).json({
        message: '로그인에 성공했습니다.',
        accessToken: token,
      });
    } catch (error) {
      next(error);
    }
  };
}
