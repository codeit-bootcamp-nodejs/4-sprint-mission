import { getUserByIdService } from "../../services/user/get_user_by_id_service.js";

export async function getUserByIdController(req, res) {
  try {
    const paramId = parseInt(req.params.id);
    const userId = req.user.id;
    if (paramId !== userId)
      return res.status(403).json({ message: "권한이 없습니다." });

    const result = await getUserByIdService(userId);
    res.status(200).json(result);
  } catch (e) {
    if (e.message == "NOT FOUND")
      res.status(404).json({ message: "회원이 없습니다." });
    res.status(500).json({ message: e.message });
  }
}
