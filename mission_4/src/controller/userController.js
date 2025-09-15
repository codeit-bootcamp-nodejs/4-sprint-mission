import * as userService from "../services/userService.js";

// for Creating user
export async function createUser(req, res, next) {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    const err = new Error("Required parameter is missing");
    err.statusCode = 400;
    next(err);
  }

  try {
    const userId = await userService.createUser(req.body);

    return res.status(200).json(userId);
  } catch (err) {
    next(err);
  }
}

// for Login
export async function getAccessToken(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email or password is wrong");
    err.statusCode = 404;
    next(err);
  }

  try {
    const user = await userService.getUser(req.body);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUserInfo(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function getMyInfo(req, res, next) {
  const userId = req.user.userId;

  try {
    const user = await userService.getUserById(userId);

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMyInfo(req, res, next) {
  const userId = req.user.userId;
  const { email, nickname } = req.body;

  if (!email && !nickname) {
    const err = new Error("Required parameter is missing");
    err.statusCode = 400;
    next(err);
  }

  try {
    const updatedUser = await userService.updateUserInfo(userId, req.body);

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function updateMyPassword(req, res, next) {
  const userId = req.user.userId;
  const { password } = req.body;

  if (!password) {
    const err = new Error("Required parameter is missing");
    err.statusCode = 400;
    next(err);
  }

  try {
    const updatedUser = await userService.updateUserPassword(userId, password);

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function getMyProducts(req, res, next) {
  const userId = req.user.userId;

  try {
    const products = await userService.getMyProducts(userId);

    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}

export async function getRefreshToken(req, res, next) {
  const userId = req.auth.userId;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    next(err);
  }

  try {
    const accessToken = await userService.refreshToken(userId, refreshToken);

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
}
