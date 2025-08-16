import express from 'express';
import prisma from '../client/prismaClient.js';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct, CreateComment } from '../validators/structor.js';
import asyncHandler from "../middlewares/asyncHandler.js";


const router = express.Router();

router.get('/', asyncHandler(async (req,res)=> {
    const { page = 0, pageSize = 5, order = "oldest", keyword = "", } = req.query;
    let orderBy;

    switch (order) {
        case "recent":
            orderBy = { createdAt: "desc" };
            break;
        case "oldest":
        default:
            orderBy = { createdAt: "asc" };
            break;
    }
    const whereClause = keyword
    ? {
        OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive"} },
        ],
    }
    : {};
    const products = await prisma.product.findMany({
        where: whereClause,
        select: {
            name: true,
            description: true,
            price: true,
            tags: true,
        },
        orderBy,
        skip: parseInt((page - 1) * pageSize),
        take: parseInt(pageSize),
    }); 
    res.status(200).json(products); //상품들 가지고 옴 
}));



router.post('/', asyncHandler(async (req,res)=> {  
    assert(req.body, CreateProduct); 
    const product = await prisma.product.create({
        data: req.body 
    }); 
    res.status(201).json(product); 
}));  


router.get('/:prouductId', asyncHandler(async (req,res)=> {
    const {prouductId} = req.params; 
    const parseId = parseInt(prouductId);
    const product = await prisma.product.findUnique({
        where: {id: parseId},
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            createdAt: true,
        },
    }); 
    res.status(200).json(product); 
}));

router.patch('/:prouductId', asyncHandler(async (req,res)=> {
    assert(req.body, PatchProduct);
    const {prouductId} = req.params; 
    const parseId = parseInt(prouductId);
    const updateData = req.body;
    const product = await prisma.product.update({
        where: {id: parseId},
        data: updateData,
    }); 
    res.status(200).json(product);
}));

router.delete('/:prouductId', asyncHandler(async (req,res)=> {
        const {prouductId} = req.params; 
        const parseId = parseInt(prouductId);
        await prisma.product.delete({
            where: {id: parseId},
        });
        res.sendStatus(204);
        res.json({ message: error.message });
}));


router.post('/:productId/comments', asyncHandler(async(req,res)=> {
    assert(req.body, CreateComment);
    const { productId } = req.params;
    const parseId = parseInt(productId);
    const { content } = req.body;
    const comment = await prisma.comment.create({
        data: {
            productId: parseId,
            content,
        }
    });
    res.status(201).json(comment);
}));

router.get('/:productId/comments', asyncHandler(async (req,res)=> {
    const { productId } = req.params;
    const parseId = parseInt(productId);
    const comments = await prisma.comment.findMany({
        where: { productId: parseId },
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
    });
    res.status(200).json(comments);
}));



export default router;