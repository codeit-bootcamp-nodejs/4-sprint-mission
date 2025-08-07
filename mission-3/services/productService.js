import { PrismaClient } from "@prisma/client";
import errorHandler from "../middlewares/routerErrorHandler.js";
import { assert, create } from 'superstruct';
import { getListValidator, idValidator } from "../validators/struct.js";
import { createValidator, patchValidator } from "../validators/productStruct.js";

const prisma = new PrismaClient();

function getProductList(){
    return errorHandler(async (req, res)=>{
        const {keyword, page, nums} = create(req.query, getListValidator)
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
    });
}

function createProduct(){
    return errorHandler(async (req, res)=>{
        assert(req.body, createValidator);
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
    })
}

function getProduct(){
    return errorHandler(async (req, res)=>{
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
    })
}

function patchProduct(){
    return errorHandler(async (req, res)=>{
        assert(req.body, patchValidator);
        const id = create(req.params, idValidator);
        const data = req.body;
        const product = await prisma.product.update({
            where: id,
            data,
        })
        res.status(200).json(product);
    })
}

function deleteProduct(){
    return errorHandler(async (req, res)=>{
        const id = create(req.params, idValidator);
        const product = await prisma.product.delete({
            where: id
        })
        res.status(200).json(product) 
    })
}

export { getProductList, createProduct, getProduct, patchProduct, deleteProduct };
