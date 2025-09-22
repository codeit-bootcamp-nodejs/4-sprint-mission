import { clearJwtTokenCookies } from "../../../lib/token.js";

export default function logoutUser(req, res, next) {
  console.log("유저 정보 수신 : " + req.user.id);
  if (!req.user) {
    return res.status(401).json({ message: "비인가" });
  }

  clearJwtTokenCookies(res);

  res.status(200).json({ message: "로그아웃" });
}
