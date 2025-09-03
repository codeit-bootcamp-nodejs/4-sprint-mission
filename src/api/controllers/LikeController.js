import LikeService from "../services/LikeService.js";

const LikeController = {
  async toggleLike(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { type, id } = req.params;
      const contentId = Number(id);

      const result = await LikeService.toggleLike(userId, type, contentId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};

export default LikeController;
