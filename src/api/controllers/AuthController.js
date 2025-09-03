import AuthService from "../services/AuthService.js";

const AuthController = {
  async signup(req, res, next) {
    try {
      const { email, nickname, password } = req.body;

      const signupData = { email, nickname, password };
      const newUser = await AuthService.signup(signupData);

      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(
        req.body
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const oldRefreshToken = req.cookies.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.refreshAccessToken(oldRefreshToken);

      // 쿠키에 토큰 저장
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  },
};

export default AuthController;
