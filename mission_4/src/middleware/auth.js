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
const verifyArticleAuth = async (req, res, next) => {
  // Get article id
  const { id } = req.params;

  // Get article author's id
  try {
    const article = await articleRepository.getPost(id);
    if (!article) {
      const err = new Error(`Article ${id} not found`);
      err.statusCode = 404;
      next(err);
    }

    // Call next if valid user
    if (req.user.userId === article.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// 상품 유저 검증
const verifyProductAuth = async (req, res, next) => {
  // Get product id
  const { id } = req.params;

  // Get product uploaders's id
  try {
    const product = await productRepository.getProduct(id);
    if (!product) {
      const err = new Error(`Product ${id} not found`);
      err.statusCode = 404;
      next(err);
    }

    // Call next if valid user
    if (req.user.userId === product.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// 게시글 존재 여부 확인
const checkArticleExist = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await articleRepository.getPost(id);
    if (!article) {
      const err = new Error(`Article ${id} not found`);
      err.statusCode = 404;
      next(err);
    } else next();
  } catch (err) {
    next(err);
  }
};

// 상품 존재 여부 확인
const checkProductExist = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await productRepository.getProduct(id);
    if (!product) {
      const err = new Error(`Product ${id} not found`);
      err.statusCode = 404;
      next(err);
    } else next();
  } catch (err) {
    next(err);
  }
};

// 게시글 댓글 유저 검증
const verifyArticleCommentAuth = async (req, res, next) => {
  const { cid } = req.params;

  try {
    const comment = await articleRepository.getComment(parseInt(cid));

    if (!comment) {
      const err = new Error(`Comment ${cid} not found`);
      err.statusCode = 404;
      next(err);
    }

    if (req.user.userId === comment.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// 상품 댓글 유저 검증
const verifyProductCommentAuth = async (req, res, next) => {
  const { cid } = req.params;

  try {
    const comment = await productRepository.getComment(parseInt(cid));

    if (!comment) {
      const err = new Error(`Comment ${cid} not found`);
      err.statusCode = 404;
      next(err);
    }

    if (req.user.userId === comment.userId) next();
    else {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      next(err);
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
