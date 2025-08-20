import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createProductValidator, 
  patchProductValidator } from '../middleware/validationMiddleWare.js';
import { asyncHandler } from '../asyncHandler.js';
import { integer } from 'superstruct';

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route('/')
  .post(createProductValidator, asyncHandler(async (req,res)=>{
    const data = req.body;  
    const newProduct = await prisma.product.create({ data });
    console.log('상품을 등록했습니다.', newProduct );
    return res.status(201).json(newProduct); 
    }))

  .get(asyncHandler(async(req, res)=>{
    const { offset =0, limit=0, order, name = '', description = '' } = req.query;
    const skip = parseInt(offset);
    const take = parseInt(limit);

    if(isNaN(skip) || isNaN(take) || skip < 0 || take < 0){  
      return res.status(404).json({ error: '페이지네이션 설정값은 양수로 설정되어야 합니다..'});
  } 
    const productList = await prisma.product.findManyOrThrow({
      where: {
        OR: [
          {name: {contains: name}},
          {description: {contains: description}},
        ]
      },
      skip, 
      take, 
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
      createdAt: order === 'newest'? 'desc' : 'asc',
      }, 
      });
    console.log('상품 목록을 조회합니다.',productList )
    return res. status(200).json(productList);
    }));

productRouter.route('/:id')
  .get(asyncHandler(async (req,res)=>{
    const id = parseInt(req.params.id);
    const datailedProduct = await prisma.product.findUniqueOrThrow({
      where : { id },
      select : { 
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true, 
        createdAt: true,
      },
    });
    console.log('해당 상품을 상세 조회합니다.',datailedProduct);
    return res.status(200).json(datailedProduct);
  }))

  .patch(patchProductValidator, asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    const { name, description, price, tags } = req.body;
    const updateToData = {};
    if(name !== undefined){
      updateToData.name = name
    }
    if(description !== undefined){
      updateToData.description = description;
    }
    if(price !== undefined){
      updateToData.price = price;
    }
    if(tags !== undefined){
      updateToData.tags = tags;
    }
    const updatedProduct = await prisma.product.update({
      where : { id }, 
      data : updateToData,
    });
    console.log('상품을 수정했습니다.', updatedProduct);
    return res.status(201).json(updatedProduct);
  }))

  .delete(asyncHandler(async(req, res)=>{
    const id = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id },
      });
    console.log('상품을 삭제했습니다.')
    return res.status(204).send(); 
    }));

export default productRouter;