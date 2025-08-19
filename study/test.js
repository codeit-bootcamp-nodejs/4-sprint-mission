import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

/*********** users ***********/

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.send(user);
});

app.post('/users', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.send(user);
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
});

/*********** products ***********/

app.get('/products', async (req, res) => {
  // 상품 목록 조회
  const products = await prisma.product.findMany();
  
  res.send(products);
});

app.get('/products/:id', async (req, res) => {
  // id에 해당하는 상품 조회
   const { id } = req.params;
   const product = await prisma.product.findUnique({
    where: { id },
  });

  res.send(product);
});

app.post('/products', async (req, res) => {
  // 리퀘스트 바디 내용으로 상품 생성
    const product = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(product);
});

app.patch('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.send(product);
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));