import { passwordHashing, validatePassword } from "../lib/bcrypt.js";
import prisma from "../lib/prisma.js";

export default function validatePasswordChange() {
  return async (req, res, next) => {
    try {
      const { changePassword, currentPassword } = req.body;
      if (!changePassword && !currentPassword) {
        // 비밀번호 변경 안함
        return next();
      }
      if (!changePassword || !currentPassword) {
        return res.status(400).json({ error: "현재 비밀번호, 변경할 비밀번호를 모두 입력해주세요" });
      }
      if (changePassword !== currentPassword) {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: req.user.id,
          },
          select: {
            password: true,
          },
        });
        if (await validatePassword(currentPassword, user.password)) {
          req.changePassword = await passwordHashing(changePassword);
          next();
        } else {
          return res.status(401).json({ error: "현재 비밀번호가 일치하지 않습니다." });
        }
      } else {
        return res.status(400).json({ error: "변경할 비밀번호는 현재 비밀번호와 달라야 합니다." });
      }
    } catch (e) {
      console.error(e);
      if (e.code === "P2025") {
        return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      }
      return res.status(400).json({ error: "비밀번호 변경 실패" });
    }
  };
}
