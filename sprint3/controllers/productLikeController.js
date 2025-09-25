import { toggleProductLike } from "../services/productLikeService.js";

export const productLike = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const productId = Number(req.params.productId);

    const result = await toggleProductLike(userId, productId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
