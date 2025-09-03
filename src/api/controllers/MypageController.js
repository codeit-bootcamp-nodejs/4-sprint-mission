import MypageService from "../services/MypageService.js";

const MypageController = {
  async getUser(req, res, next) {
    try {
      const { id: userId } = req.user;

      const user = await MypageService.getUser(userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id: userId } = req.user;
      const updateData = req.body;
      const updatedUser = await MypageService.updateUser(userId, updateData);
      res.status(201).json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { oldPassword, newPassword } = req.body;

      await MypageService.updatePassword(userId, oldPassword, newPassword);
      res.status(201).json("비밀번호 변경이 완료되었습니다.");
    } catch (err) {
      next(err);
    }
  },

  async getProducts(req, res, next) {
    try {
      const { id: userId } = req.user;

      const products = await MypageService.getProducts(userId);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
};

export default MypageController;
