import { signupService, loginService, logoutService, refreshService } from "../services/authService.js";

class AuthController {
  async signup(req, res) {
    const result = await signupService(req.body);
    return res.status(201).json(result);
  }
  async login(req, res) {
    const result = await loginService(req.body);
    return res.status(200).json(result);
  }
  async logout(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const result = await logoutService(token);
    return res.status(200).json(result);
  }
  async refresh(req, res) {
    const refreshToken = req.headers["x-refresh-token"];
    if (!refreshToken) {
      return res.status(401).json({ error: "인증이 유효하지 않습니다." });
    }
    const result = await refreshService({ refreshToken });
    return res.status(200).json(result);
  }
}
export default new AuthController();
