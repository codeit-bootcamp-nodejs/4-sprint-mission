import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; 
import {
  CreateProduct,
  PatchProduct,
} from '../sprintMission3/struct.js';

dotenv.config();

const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;  

app.use(express.json());

function asyncHandler (handler){
  return async function (req,res){
    try{
      await handler(req, res);
    } catch(e){
      if(
        e.name === 'sturctError' ||
        e instanceof Prisma.PrismaClientValidationError
      ){
        res.status(400).json({ message: e.message});
      } else if(
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ){
        res.status(404).json({ message: e.message});
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  };
}

//상품 등록 API
app.post('/products', asyncHandler(async (req,res)=>{
  const data = req.body  
  assert (req.body, CreateProduct);
  const newProduct = await prisma.product.create({data}) 
  res.status(201).json(newProduct); 
  }));

// 상품 상세 조회 API 
app.get('/products/:id', asyncHandler(async (req,res)=>{
 const id = parseInt(req.params.id);
 const datailedProduct = await prisma.product.findUniqueOrThrow({
  where : { id},
  select : { 
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true, 
      createdAt: true,
    },
  });
  if(detailedProduct){
  res.status(201).json(detailedProduct);
  } else {
  res.status(404).json({ error: '조건에 맞는 상품을 조회할 수 없습니다. ' });   
  }
}));

//상품 목록 조회 API를 만들어 주세요. 
app.get('/products', asyncHandler(async(req, res)=>{
  const { offset =0, limit=0, order, name, description } = req.query;

  const skip = parseInt(offset);
  const take = parseInt(limit);

  if(skip < 0 || take< 0){
  res.status(404).json({ error: '페이지네이션 설정값은 음수가 될 수 없습니다.'})
}


const productList = await prisma.product.findManyOrThrow({
  where: {
    name,
    description,
  },
  skip, 
  take, 
  select: {
    id: true,
    title: true,
    content: true,
    createdAt: true,
   },
  orderBy: {
    createdAt: order === 'newest'? 'desc' : 'asc',
  }, 
  });
res. status(201).json(productList)
}));


//상품 수정 API
app.patch('/products/:id', asyncHandler(async(req, res)=>{
  assert (req.body, CreateProduct);
  const id = parseInt(req.params.id);
  const data = req.body; 
  const patchedProduct = await prisma.product.update({
    where : { id }, 
    data , 
  });
  res.status(201).json(patchedProduct)
}));

//상품 삭제 API
app.delete('/products/:id', asyncHandler(async(req, res)=>{
  const id = parseInt(req.params.id);
  await prisma.product.delete({
      where: { id },
    });
  res.status(204).send(); 
  }));


// 서버 시작
app.listen(PORT,() =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});

//애플리케이션 종료 시 Prisma클라이언트 연결 해제 
process.on('beforeExit', async () =>{
  await prisma.$disconnect();
});
