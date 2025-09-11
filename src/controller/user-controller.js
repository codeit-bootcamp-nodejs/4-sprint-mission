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

  // 내 정보 조회
  getMyInfo = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const userInfo = await this.userService.getUserInfo(userId);
      res.status(200).json({ data: userInfo });
    } catch (error) {
      next(error);
    }
  };

  // 내 정보 수정
  updateMyInfo = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const userInfoData = req.body;
      const updatedUser = await this.userService.updateUserInfo(
        userId,
        userInfoData,
      );
      res.status(200).json({
        message: '사용자 정보가 성공적으로 수정되었습니다.',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  // 비밀번호 변경
  changeMyPassword = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { currentPassword, newPassword } = req.body;

      // 필수 값 확인
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
        });
      }

      await this.userService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );
      res
        .status(200)
        .json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 등록한 상품 조회
  getMyProducts = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const products = await this.userService.getMyProducts(userId);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  getLikedProducts = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const products = await this.userService.getLikedProducts(userId);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  getLikedArticles = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const articles = await this.userService.getLikedArticles(userId);
      res.status(200).json({ data: articles });
    } catch (error) {
      next(error);
    }
  };
}
