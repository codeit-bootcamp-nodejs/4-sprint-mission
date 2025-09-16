import { getUserLikeService } from "../../services/user/get_user_like_service.js";

export async function getUserLikeController(req, res) {
  try {
    const user = req.user;
    const result = await getUserLikeService(user);
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
