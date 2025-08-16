import express from 'express';
import prisma from '../client/prismaClient.js';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle, CreateComment, PatchComment } from '../validators/structor.js';
import asyncHandler from "../middlewares/asyncHandler.js";


const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
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
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
        ],
    }
    : {};
    const articles = await prisma.article.findMany({
        where: whereClause,
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
        },
        orderBy,
        skip: parseInt((page - 1) * pageSize),
        take: parseInt(pageSize),
    }); //최소 1부터 여러개 => 복수로 변수명 적는게 좋다 - ! 혹은 list로
    res.status(200).json(articles);
}));



router.post('/', asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
        data: req.body
    });
    res.status(201).json(article);
}));

router.get('/:articleId', asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const parseId = parseInt(articleId);
    const article = await prisma.article.findUnique({
        where: { id: parseId },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
        },
    });
    res.status(200).json(article);
}));



router.patch('/:articleId', asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { articleId } = req.params;
    const parseId = parseInt(articleId);
    const updateData = req.body;
    const article = await prisma.article.update({
        where: { id: parseId },
        data: updateData,
    });
    res.status(200).json(article);
}));

router.delete('/:articlesId', asyncHandler(async (req, res) => {
        const { articlesId } = req.params;
        const parseId = parseInt(articlesId);
        await prisma.article.delete({
            where: { id: parseId },
        });
        res.sendStatus(204);
        res.json({ message: error.message });
   
}));



//자유게시판에 댓글 등록 comment로 
router.post('/:articleId/comments', asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { articleId } = req.params;
    const parseId = parseInt(articleId);
    const { content } = req.body;
    const comment = await prisma.comment.create({
        data: {
            articleId: parseId,
            content,
        }
    });
    res.status(201).json(comment);
}));



//댓글 목록 조회
router.get('/:articleId/comments', asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const parseId = parseInt(articleId);
    const { cursor, limit = 5 } = req.query;
    const comments = await prisma.comment.findMany({
        where: { articleId: parseId },
        orderBy: {
            createdAt: 'desc' //페이징 정렬 기본
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
        take: parseInt(limit),
        ...(cursor && { cursor: { id: parseInt(cursor) }, skip: 1 }),
    });

    const nextCursor =
        comments.length === parseInt(limit) ? comments[comments.length - 1].id : null;
    res.status(200).json({ comments, nextCursor });
}));

export default router;

