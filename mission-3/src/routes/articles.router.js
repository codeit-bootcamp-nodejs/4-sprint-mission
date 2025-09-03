
import express from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { validateArticleData } from "../middlewares/articles.middleware.js";
import { asyncHandler } from "../middlewares/async-handler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.route('/')
    // 게시글 등록 API
    .post(validateArticleData, asyncHandler(async (req, res) => {
        const { title, content } = req.body;
        const newArticle = await prisma.article.create({
            data: { title, content },
        });
        res.status(201).json({ message: "게시글이 등록 완료", data: newArticle });
    }))
    // 게시글 목록 조회 API
    .get(asyncHandler(async (req, res) => {
        const { page, pageSize, sortBy, search } = req.query;
        const pageNum = parseInt(page) || 1;
        const pageSizeNum = parseInt(pageSize) || 10;
        const skip = (pageNum - 1) * pageSizeNum;
        const orderBy = sortBy === "recent" ? { createdAt: "desc" } : {};
        const where = search ? {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ],
        } : {};

        const articles = await prisma.article.findMany({
            where, orderBy, skip, take: pageSizeNum,
            select: { id: true, title: true, content: true, createdAt: true },
        });
        res.status(200).json({ data: articles });
    }));

// 게시글 상세, 수정, 삭제 API
router.route('/:articleId')
    .get(asyncHandler(async (req, res) => {
        const { articleId } = req.params;
        const article = await prisma.article.findUnique({
            where: { id: parseInt(articleId) },
            select: { id: true, title: true, content: true, createdAt: true },
        });
        if (!article) {
            return res.status(404).json({ message: "게시글을 찾을수 없음" });
        }
        res.status(200).json({ data: article });
    }))
    .patch(validateArticleData, asyncHandler(async (req, res) => {
        const { articleId } = req.params;
        const { title, content } = req.body;
        const article = await prisma.article.findUnique({ where: { id: parseInt(articleId) } });
        if (!article) {
            return res.status(404).json({ message: "게시글 찾을수 없음" });
        }
        const updatedArticle = await prisma.article.update({
            where: { id: parseInt(articleId) },
            data: { title, content },
        });
        res.status(200).json({ message: "성공적으로 게시글 수정 완료", data: updatedArticle });
    }))
    .delete(asyncHandler(async (req, res) => {
        const { articleId } = req.params;
        const article = await prisma.article.findUnique({ where: { id: parseInt(articleId) } });
        if (!article) {
            return res.status(404).json({ message: "게시글 찾을 수 없음" });
        }
        await prisma.article.delete({ where: { id: parseInt(articleId) } });
        res.status(200).json({ message: "성공적으로 삭제 완료", data: { id: parseInt(articleId) } });
    }));

// 게시글 댓글 관련 API
router.route('/:articleId/comments')
    .post(asyncHandler(async (req, res) => {
        const { articleId } = req.params;
        const { content } = req.body;
        const article = await prisma.article.findUnique({ where: { id: parseInt(articleId) } });
        if (!article) {
            return res.status(404).json({ message: "게시글을 찾을수 없음" });
        }
        if (!content) {
            return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
        }
        const newComment = await prisma.articleComment.create({
            data: { content, articleId: parseInt(articleId) },
        });
        res.status(201).json({ message: "댓글 등록완료", data: newComment });
    }))
    .get(asyncHandler(async (req, res) => {
        const { articleId } = req.params;
        const { cursor, pageSize } = req.query;
        const pageSizeNum = parseInt(pageSize) || 10;
        const findOptions = {
            where: { articleId: parseInt(articleId) },
            take: pageSizeNum,
            orderBy: { createdAt: 'desc' },
            select: { id: true, content: true, createdAt: true },
        };
        if (cursor) {
            findOptions.cursor = { id: parseInt(cursor) };
            findOptions.skip = 1;
        }
        const comments = await prisma.articleComment.findMany(findOptions);
        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
        res.status(200).json({ data: comments, nextCursor });
    }));

router.route('/:articleId/comments/:commentId')
    .patch(asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "수정할 내용을 입력하세요" });
        }
        const comment = await prisma.articleComment.findUnique({ where: { id: parseInt(commentId) } });
        if (!comment) {
            return res.status(404).json({ message: "댓글을 찾을 수 없음" });
        }
        const updatedComment = await prisma.articleComment.update({
            where: { id: parseInt(commentId) },
            data: { content },
        });
        res.status(200).json({ message: "댓글이 성공적으로 수정되었습니다.", data: updatedComment });
    }))
    .delete(asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const comment = await prisma.articleComment.findUnique({ where: { id: parseInt(commentId) } });
        if (!comment) {
            return res.status(404).json({ message: "댓글을 찾을 수 없음" });
        }
        await prisma.articleComment.delete({ where: { id: parseInt(commentId) } });
        res.status(200).json({ message: "댓글 삭제완료", data: { id: parseInt(commentId) } });
    }));

export default router;
