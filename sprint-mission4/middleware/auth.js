import bcrypt from 'bcrypt';
import { expressjwt } from 'express-jwt';
import { PrismaClient } from '@prisma/client';

import UserService from '../service/user-service.js'
const prisma = new PrismaClient();

// 비밀번호 검증 함수
async function verifyPassword(inputPassword, password) {
  try {
    return await bcrypt.compare(inputPassword, password);
  } catch (error) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
}

// JWT 토큰 검증 미들웨어 (인증 미들웨어)
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
});

// 등록 user 권한 (인가)
const verifyUserRole = async(req, res, next) => {
  let review = null;
  if (req.params.articleId) {
    review = await prisma.article.findUnique({ where: { id: Number(req.params.articleId) } });
  } else if (req.params.productId) {
    review = await prisma.product.findUnique({ where: { id: Number(req.params.productId) } });
  } else if (req.params.articleCommentId) {
    review = await prisma.articleComment.findUnique({ where: { id: Number(req.params.articleCommentId) } });
  } else if (req.params.productCommentId) {
    review = await prisma.productComment.findUnique({ where: { id: Number(req.params.productCommentId) } });
  } else if (req.params.userId) {
    review = await prisma.user.findUnique({ where: { id: Number(req.params.userId) } });
  }
  const reviewId = review.userId || review.id
  if (reviewId !== req.user.userId) {
    const error = new Error('작성자만 가능합니다.')
    throw error
  }
  return next()
};

export default { 
  verifyPassword,
  verifyAccessToken,
  verifyUserRole
 };