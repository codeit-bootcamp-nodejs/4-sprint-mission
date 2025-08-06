import express from 'express';
import { PrismaClient } from '@prisma/client';
import productCommentRouter from './productCommentRouter.js';
import { assert, create } from 'superstruct';
import { createProduct, getProductList, idValidator, patchProduct } from '../validators/productStruct.js';
import errorHandler from '../middlewares/routerErrorHandler.js';
import parentIdParser from '../middlewares/parnetIdParser.js';

const productRouter = express.Router();
const prisma = new PrismaClient();

productRouter.use('/:id/comment', parentIdParser, productCommentRouter);

productRouter.route('/')
    .get(errorHandler(async (req, res)=>{
        const {keyword, page, nums} = create(req.query, getProductList)
        const productList = await prisma.product.findMany({
            where: {
                OR: [
                    {name: { contains: keyword }},
                    {description: { contains: keyword }},
                ]
            },
            select:{
                id: true,
                name: true,
                price: true,
                createdAt: true,
            },
            skip: page*nums,
            take: nums,
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.status(200).json(productList);
    }))
    .post(errorHandler(async (req, res)=>{
        assert(req.body, createProduct);
        const {name, description, price, tags} = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price, 
                tags,
            }
        })
        res.status(201).json(product);
    }))

productRouter.route('/:id')
    .get(errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const product = await prisma.product.findUniqueOrThrow({
            where: id,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            }
        })
        res.status(200).json(product);
    }))
    .patch(errorHandler(async (req, res)=>{
        assert(req.body, patchProduct);
        const id = create(req.params, idValidator);
        const data = req.body;
        const product = await prisma.product.update({
            where: id,
            data,
        })
        res.status(200).json(product);
    }))
    .delete(errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const product = await prisma.product.delete({
            where: id
        })
        res.status(200).json(product) 
    }))

export default productRouter;
