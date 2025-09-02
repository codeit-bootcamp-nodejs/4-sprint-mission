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
      const { user, token } = await AuthService.login(req.body);
      res.status(200).json({ user, accessToken: token });
      next();
    } catch (err) {
      next(err);
    }
  },
};

export default AuthController;
