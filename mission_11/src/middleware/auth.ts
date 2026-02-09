import type { RequestHandler } from "express";
import { expressjwt } from "express-jwt";
import * as articleRepository from "../repository/articleRepository.js";
import * as productRepository from "../repository/productRepository.js";

// 토큰 검증
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

// refresh 토큰 검증
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

// 게시글 유저 검증
const verifyArticleAuth: RequestHandler = async (req, res, next) => {
  // Get article id
  const { id } = req.params;

  // Get article author's id
  try {
    const article = await articleRepository.getPost({ id: Number(id) });
    if (!article) {
      const err = new Error(`Article ${id} not found`);
      err.statusCode = 404;
      return next(err);
    }

    // Call next if valid user
    if (req.user && req.user.userId === article.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

// 상품 유저 검증
const verifyProductAuth: RequestHandler = async (req, res, next) => {
  // Get product id
  const { id } = req.params;

  // Get product uploaders's id
  try {
    const product = await productRepository.getProduct({ id: Number(id) });
    if (!product) {
      const err = new Error(`Product ${id} not found`);
      err.statusCode = 404;
      return next(err);
    }

    // Call next if valid user
    if (req.user && req.user.userId === product.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

// 게시글 존재 여부 확인
const checkArticleExist: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await articleRepository.getPost({ id: Number(id) });
    if (!article) {
      const err = new Error(`Article ${id} not found`);
      err.statusCode = 404;
      return next(err);
    } else next();
  } catch (err) {
    next(err);
  }
};

// 상품 존재 여부 확인
const checkProductExist: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await productRepository.getProduct({ id: Number(id) });
    if (!product) {
      const err = new Error(`Product ${id} not found`);
      err.statusCode = 404;
      return next(err);
    } else next();
  } catch (err) {
    next(err);
  }
};

// 게시글 댓글 유저 검증
const verifyArticleCommentAuth: RequestHandler = async (req, res, next) => {
  const { cid } = req.params;

  if (!cid) {
    const err = new Error("Comment id is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const comment = await articleRepository.getComment({ cid: parseInt(cid) });

    if (!comment) {
      const err = new Error(`Comment ${cid} not found`);
      err.statusCode = 404;
      return next(err);
    }

    if (req.user && req.user.userId === comment.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 유저 검증
const verifyProductCommentAuth: RequestHandler = async (req, res, next) => {
  const { cid } = req.params;

  if (!cid) {
    const err = new Error("Comment id is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const comment = await productRepository.getComment({ cid: parseInt(cid) });

    if (!comment) {
      const err = new Error(`Comment ${cid} not found`);
      err.statusCode = 404;
      return next(err);
    }

    if (req.user && req.user.userId === comment.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyArticleAuth,
  verifyProductAuth,
  checkArticleExist,
  checkProductExist,
  verifyArticleCommentAuth,
  verifyProductCommentAuth,
};
