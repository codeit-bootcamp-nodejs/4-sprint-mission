import {
  getUserService,
  patchUserService,
  deleteUserService,
  getUserContentListService,
  getUserContentLikeListService,
} from '../services/userService.js';

class UserController {
  async getUser(req, res) {
    const { id } = req.tokenPayload;
    const result = await getUserService({ id });
    return res.status(200).json(result);
  }
  async patchUser(req, res) {
    const { id } = req.tokenPayload;
    const data = req.body;
    const result = await patchUserService({ id, data });
    return res.status(200).json(result);
  }
  async deleteUser(req, res) {
    const { id } = req.tokenPayload;
    const result = await deleteUserService({ id });
    return res.status(200).json(result);
  }
  async getUserContentList(req, res) {
    const { id } = req.tokenPayload;
    const content = req.content;
    const result = await getUserContentListService({ id, content });
    return res.status(200).json(result);
  }
  async getUserContentLikeList(req, res) {
    const { id } = req.tokenPayload;
    const content = req.content;
    const result = await getUserContentLikeListService({ id, content });
    return res.status(200).json(result);
  }
}

export default new UserController();
