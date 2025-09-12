import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import auth from '../middleware/auth.js';
import token from '../middleware/token.js';
import dotenv from 'dotenv'

dotenv.config();

const prisma = new PrismaClient();

// 유저 조회
const getUserById = async(req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.userId) },
    select: {
      id: true,
      email: true,
      nickname: true,
      image : true,
      createdAt: true,
      updatedAt: true,
      }
  });
  res.status(200).send(user);
};

// 유저 생성 (회원가입)
const createUsers = async(req, res) => {
  const existUser = await prisma.user.findUnique({
    where: { email: req.body.email }
  });
  if (existUser) {
    return res.status(409).send({ errorMessage: '이미 가입된 이메일입니다.' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = await prisma.user.create({
    data: {
      ...req.body,
      password: hashedPassword,
    },
  });
  const { password, ...safeUser } = user;
  res.status(201).send(safeUser);
};

// 유저 수정 (회원정보 수정)
const updateUsers = async(req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = await prisma.user.update({
    where: { id: Number(req.params.userId) },
    data: {
      ...req.body,
      password: hashedPassword,
    }
  });
  const accessToken = await token.createToken(user);
  const refreshToken = await token.createToken(user, 'refresh');
  res.status(200).send({ accessToken, refreshToken });
};

// 로그인
const login = async(req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  await auth.verifyPassword(password, user.password);
  const accessToken = await token.createToken(user);
  const refreshToken = await token.createToken(user, 'refresh');
  //cookie-header로 refreshToken response
  res.cookie('refreshToken', refreshToken, { 
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    return res.json({ accessToken });
};

const getProductsByUserId = async(req, res) => {
  const products = await prisma.product.findMany({
    where: { userId: Number(req.params.userId) },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      productLikes : true,
      }
  });
  res.status(200).send(products);
}

const getLikeByUserId = async(req, res) => {
  const userId = req.user.userId
  const likeproducts = await prisma.productLike.findMany({
    where: { userId: userId },
    select: {
      product : true
      }
  });
  res.status(200).send(likeproducts);
}

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies
  const userId = req.user.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  const newAccessToken = createToken(user, "access");
  return res.json({ accessToken: newAccessToken });
}

export default { 
  getUserById, 
  createUsers, 
  updateUsers,
  login,
  getProductsByUserId,
  refreshToken,
  getLikeByUserId
};
