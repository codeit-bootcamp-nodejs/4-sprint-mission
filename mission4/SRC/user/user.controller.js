import { UserService } from "./user.service.js";

export class UserController {
  constructor() {
    this.userService = new UserService();
  }
  async createUserController(req, res) {
    const { email, nickname, password } = req.body;
    try {
      const user = await this.userService.createUser({
        email,
        nickname,
        password,
      });
      res.json({ message: "성공적인 데이터 성공", data: user });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async patchUserPasswordController(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = Number(req.params.userId);
    try {
      const updated_user = await this.userService.patchUserPassword({
        userId,
        old_password: oldPassword,
        new_password: newPassword,
      });
      res.json(updated_user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getUserProductListController(req, res) {
    const userId = Number(req.params.userId);
    try {
      const userProductList = await this.userService.getUserProductList({
        userId,
      });
      res.json(userProductList);
    } catch (error) {
      console.error("internal server error");
    }
  }
  async patchUserInfoController(req, res) {
    const userId = Number(req.params.userId);
    try {
      const updatedUser = await this.userService.patchUserInfo({ userId });
      res.json(updatedUser);
    } catch (error) {
      console.error("internal server error");
    }
  }
  async getUserInfoController(req, res) {
    const userId = Number(req.params.userId);
    try {
      const userInfo = await this.userService.getUserInfo({ userId });
      res.json(userInfo);
    } catch (error) {
      console.error("internal server error");
    }
  }
}
