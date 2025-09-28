import * as userService from "../services/userService.js";
import type { RequestHandler } from "express";

// for Creating user
const createUser: RequestHandler = async function (req, res, next) {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    const err = new Error("Required parameter is missing");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const userId = await userService.createUser({ email, nickname, password });

    return res.status(200).json(userId);
  } catch (err) {
    next(err);
  }
};

// for Login
const getAccessToken: RequestHandler = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email or password is wrong");
    err.statusCode = 404;
    return next(err);
  }

  try {
    const user = await userService.getUser(req.body);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUserInfo(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const getMyInfo: RequestHandler = async function (req, res, next) {
  const userId = req.user ? req.user.userId : null;

  if (!userId) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const user = await userService.getUserById(userId);

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateMyInfo: RequestHandler = async function (req, res, next) {
  const userId = req.user ? req.user.userId : null;
  const { email, nickname } = req.body;

  if (!email && !nickname || userId === null) {
    const err = new Error("Required parameter is missing");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const updatedUser = await userService.updateUserInfo(userId, req.body);

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const updateMyPassword: RequestHandler = async function (req, res, next) {
  const userId = req.user ? req.user.userId : null;
  const { password } = req.body;

  if (userId === null) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  if (!password) {
    const err = new Error("Required parameter is missing");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const updatedUser = await userService.updateUserPassword(userId, password);

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const getMyProducts: RequestHandler = async function (req, res, next) {
  const userId = req.user ? req.user.userId : null;
  if (userId === null) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const products = await userService.getMyProducts(userId);

    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const getRefreshToken: RequestHandler = async function (req, res, next) {
  const userId = req.auth ? req.auth.userId : null;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    next(err);
  }

  try {
    const accessToken = await userService.refreshToken(Number(userId), refreshToken);

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export {
  createUser,
  getAccessToken,
  getMyInfo,
  updateMyInfo,
  updateMyPassword,
  getMyProducts,
  getRefreshToken,
};
