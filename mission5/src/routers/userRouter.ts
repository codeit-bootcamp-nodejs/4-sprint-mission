import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import passport from "../lib/passport/index";
import status from "http-status";
import { generateTokens } from "../lib/token";
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../lib/constants";

const router = express.Router();

router.post("/users/register", register);
router.post(
  "/users/login",
  passport.authenticate("local", { session: false }),
  login
);
router.get(
  "/users/profile",
  passport.authenticate("access-token", { session: false }),
  profile
);
router.patch(
  "/users/modifyInformation",
  passport.authenticate("access-token", { session: false }),
  modifyinformation
);
router.patch(
  "/users/modifyPassword",
  passport.authenticate("access-token", { session: false }),
  modifyPassword
);
router.get(
  "/users/products",
  passport.authenticate("access-token", { session: false }),
  products
);
router.post(
  "/users/refresh",
  passport.authenticate("refresh-token", { session: false }),
  refreshTokens
);
router.post("/users/logout", logout);

async function register(req: Request, res: Response, next: NextFunction) {
  const { email, nickname, password } = req.body;

  try {
    const check = await prisma.user.findUnique({ where: { email } });
    if (check) {
      return res
        .status(status.CONFLICT)
        .json({ message: "This ID already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    res
      .status(status.CREATED)
      .json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
}

function login(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    const { accessToken, refreshToken } = generateTokens(req.user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.status(status.OK).json({ token: accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function profile(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const profile = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(status.OK).json(profile);
  } catch (err) {
    next(err);
  }
}

async function modifyinformation(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { nickname, image } = req.body as { nickname?: string; image?: string };

  try {
    const updateData: Record<string, string> = {};
    if (nickname) updateData.nickname = nickname;
    if (image) updateData.image = image;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "No update data provided" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });

    res.status(status.OK).json({
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

async function modifyPassword(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
      },
    });

    res
      .status(status.OK)
      .json({ message: "User passowrd updated successfully" });
  } catch (err) {
    next(err);
  }
}

async function products(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        name: true,
        description: true,
        price: true,
        tags: true,
      },
    });
    if (!products) {
      return res.status(status.NOT_FOUND).json({ message: "No product" });
    }
    res.status(status.OK).json(products);
  } catch (err) {
    next(err);
  }
}

function logout(req: Request, res: Response) {
  clearTokenCookies(res);
  res.status(status.OK).send({ message: "Logged out successfully" });
}

async function refreshTokens(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    req.user.id
  );
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(status.OK).send({ message: "Tokens refreshed" });
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/users/refresh",
  });
}

function clearTokenCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export default router;