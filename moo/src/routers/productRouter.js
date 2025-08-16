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



router.post('/', asyncHandler(async (req,res)=> { //첫번쨰 인자는 경로, 가운데 미들웨어 기능넣기 가능, 두번째 핸들러 
    assert(req.body, CreateProduct); //여기서 유효성 검사를 진행 -> structor가 에러 객체를 만들어서 던짐 근데. async핸들러가 그걸 잡아냄. 
    const product = await prisma.product.create({
        data: req.body //어쩔 수 업슨 문법
    }); //db에 넣을 것
    res.status(201).json(product); //받아온 결과 넣는 것
})); //프리즈마 자체가 비동기  


router.get('/:prouductId', asyncHandler(async (req,res)=> {
    const {prouductId} = req.params; //얘는 지금 스트링으로 받음
    const parseId = parseInt(prouductId);//문자를 숫자로 파싱해줌
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
    res.status(200).json(product); //상태코드 겸 데이터 ? 
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

// 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
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
    // res.json(content);
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



export default router; //객체에 커스텀했고 밖에서 쓸 수 있게 내보내겟다. 