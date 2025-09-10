import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

const updateUsers = async(req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.userId) },
    data: req.body,
  });
  res.status(200).send(user);
}

export default { 
  getUserById, 
  createUsers, 
  updateUsers  };

//////////////////////////////////////////////////////////////////////////////////



const deleteArticles = async(req, res) => {
  await prisma.article.delete({
    where: { id: Number(req.params.articleId) },
  });
  res.status(204).send();
}

const getArticleComments = async(req, res) => {
  const articleComments = await prisma.articleComment.findMany({
    where: { articleId: Number(req.params.articleId) },
  });
  res.status(200).send(articleComments);
}

const createArticleComment = async(req, res) => {
  const articleComments = await prisma.articleComment.create({
    data: req.body,
  });
  res.status(201).send(articleComments);
}

const updateArticleComment = async(req, res) => {
  const articleComments = await prisma.articleComment.update({
    where: { id: Number(req.params.commentId) },
    data: req.body,
  });
  res.status(200).send(articleComments);
}

const deleteArticleComment = async(req, res) => {
  const articleComments = await prisma.articleComment.delete({
    where: { id: Number(req.params.commentId) },
  });
  res.status(204).send(articleComments);
}