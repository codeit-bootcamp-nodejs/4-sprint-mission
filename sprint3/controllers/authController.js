import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../services/authService.js";
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../lib/constants.js";

export async function register(req, res, next) {
  try {
    const { email, nickname, password } = req.body;

    const user = await registerUser(email, nickname, password);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export const login = async (req, res, next) => {
  const user = req.user;

  try {
    const { accessToken, refreshToken } = await loginUser(user);

    setTokenCookies(res, accessToken, refreshToken);

    return res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  const user = req.user;

  try {
    const { accessToken, refreshToken } = await refreshAccessToken(user);

    setTokenCookies(res, accessToken, refreshToken);

    return res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

  res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
};

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/auth/refresh",
  });
}
