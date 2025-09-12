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
  res.status(200).send(user);
};

// 로그인
const login = async(req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  await auth.verifyPassword(password, user.password);
  const accessToken = await token.createToken(user);
  res.status(200).send({ accessToken });
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
      }
  });
  res.status(200).send(products);
}

export default { 
  getUserById, 
  createUsers, 
  updateUsers,
  login,
  getProductsByUserId,
};
