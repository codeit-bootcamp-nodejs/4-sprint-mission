import { updateUserService } from "../../services/user/update_user_service.js";
import bcrypt from "bcrypt";

export async function updateUserController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    if (id !== userId)
      return res.status(403).json({ message: "권한이 없습니다" });
    const { nickname, password } = req.body;
    const updateData = {};

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (nickname) updateData.nickname = nickname;
    if (password) updateData.password = hashedPassword;

    const result = await updateUserService({ id, updateData });
    res.send(result);
  } catch (e) {
    if (e.message === "NOT_FOUND") {
      res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }
    res.json({ message: e.message });
  }
}
