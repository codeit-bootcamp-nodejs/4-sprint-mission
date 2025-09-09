import {
  getUserService,
  patchUserService,
  deleteUserService,
  getUserContentListService,
  getUserContentLikeListService,
} from '../services/userService.js';

class UserController {
  async getUser(req, res) {
    const result = await getUserService(req.user);
    return res.status(200).json(result);
  }
  async patchUser(req, res) {
    const args = {
      id: req.user.id,
      data: req.body,
    };
    const result = await patchUserService(args);
    return res.status(200).json(result);
  }
  async deleteUser(req, res) {
    const result = await deleteUserService(req.user);
    return res.status(200).json(result);
  }
  async getUserContentList(req, res) {
    const args = {
      id: req.user.id,
      content: req.content,
    };
    const result = await getUserContentListService(args);
    return res.status(200).json(result);
  }
  async getUserContentLikeList(req, res) {
    const args = {
      id: req.user.id,
      content: req.content,
    };
    const result = await getUserContentLikeListService(args);
    return res.status(200).json(result);
  }
}

export default new UserController();
