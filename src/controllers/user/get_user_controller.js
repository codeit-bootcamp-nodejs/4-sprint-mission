import { getUserService } from "../../services/user/get_user_service.js";

export async function getUserController(req, res) {
  try {
    const result = await getUserService();
    res.status(200).json(result);
  } catch (e) {
    if (e.message == "NOT FOUND")
      res.status(404).json({ message: "회원이 없습니다." });
    res.status(500).json({ message: e.message });
  }
}
