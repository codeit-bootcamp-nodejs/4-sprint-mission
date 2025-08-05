import express from 'express';
import { PrismaClient } from '@prisma/client';

const productRouter = express.Router();
const prisma = new PrismaClient();

productRouter.use(express.json());

productRouter.route('/')
    .get(async (req, res)=>{
        const {keyword, page = 0} = req.query;
        const take = 10;
        const skip = parseInt(page)*take;
        const where = keyword ? { 
            OR: [
                {name: { contains: keyword }},
                {description: { contains: keyword }},
            ]
        } : {};
        try{
            const getProductList = await prisma.product.findMany({
                where,
                select:{
                    id: true,
                    name: true,
                    price: true,
                    createdAt: true,
                },
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            })
            res.status(200).json(getProductList);
        }catch(e){
            console.error(e);
            res.status(500).json({error:'server error'})
        }
    })
    .post(async (req, res)=>{
        const {name, description, price, tags} = req.body;
        try{
            const createProduct = await prisma.product.create({
                data: {
                    name,
                    description,
                    price, 
                    tags,
                }
            })
            res.status(201).json(createProduct);
        }catch(e){
            console.error(e);
            res.status(500).json({error:'server error'})
        }
    })

productRouter.route('/:id')
    .get(async (req, res)=>{
        const id = parseInt(req.params.id);
        try{
            const getProduct = await prisma.product.findUniqueOrThrow({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    tags: true,
                    createdAt: true,
                }
            })
            res.status(200).json(getProduct);
        }catch(e){
            console.error(e);
            if(e.code === 'P2025'){
                res.status(404).json({error:'해당 상품이 존재하지 않습니다.'})
            }else{
                res.status(500).json({error:'server error'});
            }
        }
    })
    .patch(async (req, res)=>{
        const id = parseInt(req.params.id);
        const data = req.body;
        try{
            const patchProduct = await prisma.product.update({
                where: { id },
                data,
            })
            res.status(200).json(patchProduct);
        }catch(e){
            console.error(e);
            if(e.code === 'P2025'){
                res.status(404).json({error:'해당 상품이 존재하지 않습니다.'})
            }else{
                res.status(500).json({error:'server error'});
            }
        }
    })
    .delete(async (req, res)=>{
        const id = parseInt(req.params.id);
        try{
            const deleteProduct = await prisma.product.delete({
                where: { id }
            })
            res.status(200).json(deleteProduct)
        }catch(e){
            console.error(e);
            if(e.code === 'P2025'){
                res.status(404).json({error:'해당 상품이 존재하지 않습니다.'})
            }else{
                res.status(500).json({error:'server error'});
            }
        }
    })

export default productRouter;
