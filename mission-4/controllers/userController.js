import {
  getUserService,
  patchUserService,
  deleteUserService,
  getUserContentListService,
} from "../services/userService.js";

class UserController {
  async getUser(req, res) {
    const result = await getUserService(req.user);
    return res.status(200).json(result);
  }
  async patchUser(req, res) {
    const { changePassword, currentPassword, ...data } = req.body;
    if (req.changePassword) {
      data.password = req.changePassword;
    }
    const args = {
      id: req.user.id,
      data,
    };
    const result = await patchUserService(args);
    return res.status(200).json(result);
  }
  async deleteUser(req, res) {
    const result = await deleteUserService(req.user);
    return res.status(200).json(result);
  }
  async getUserContentList(req, res) {
    const { content } = req.params;
    const args = {
      id: req.user.id,
      content: content.charAt(0).toUpperCase() + content.slice(1),
    };
    const result = await getUserContentListService(args);
    return res.status(200).json(result);
  }
}

export default new UserController();
