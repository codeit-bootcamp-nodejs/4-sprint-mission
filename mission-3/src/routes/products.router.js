
import express from "express";
import { PrismaClient } from '../generated/prisma/index.js';
import { validateProductData } from "../middlewares/products.middleware.js";
import { asyncHandler } from "../middlewares/async-handler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.route('/')
    // 상품 등록 API
    .post(validateProductData, asyncHandler(async (req, res) => {
        const { name, description, price, tags } = req.body;
        const newProduct = await prisma.product.create({
            data: { name, description, price, tags },
        });
        res.status(201).json({
            message: "상품이 성공적으로 등록되었습니다.",
            data: newProduct,
        });
    }))
    // 상품 목록 조회 API
    .get(asyncHandler(async (req, res) => {
        const { page, pageSize, sortBy, search } = req.query;
        const pageNum = parseInt(page) || 1;
        const pageSizeNum = parseInt(pageSize) || 10;
        const skip = (pageNum - 1) * pageSizeNum;
        const orderBy = sortBy === 'recent' ? { createdAt: 'desc' } : {};
        const where = search ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ],
        } : {};

        const products = await prisma.product.findMany({
            where, orderBy, skip, take: pageSizeNum,
            select: { id: true, name: true, price: true, createdAt: true },
        });
        res.status(200).json({ data: products });
    }));

// 상품 상세, 수정, 삭제 API
router.route('/:productId')
    .get(asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true },
        });
        if (!product) {
            return res.status(404).json({ message: "상품이 존재하지 않음" });
        }
        res.status(200).json({ data: product });
    }))
    .patch(validateProductData, asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const { name, description, price, tags } = req.body;
        const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
        if (!product) {
            return res.status(404).json({ message: "상품이 없음" });
        }
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { name, description, price, tags },
        });
        res.status(200).json({
            message: "상품 정보 성공적으로 처리 완료 !!",
            data: updatedProduct,
        });
    }))
    .delete(asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
        if (!product) {
            return res.status(404).json({ message: "상품이 없음" });
        }
        await prisma.product.delete({ where: { id: parseInt(productId) } });
        res.status(200).json({ message: "상품 삭제완료", data: { id: parseInt(productId) } });
    }));

// 상품 댓글 관련 API
router.route('/:productId/comments')
    .post(asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const { content } = req.body;
        const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
        if (!product) {
            return res.status(404).json({ message: "상품을 찾을수 없음" });
        }
        if (!content) {
            return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
        }
        const newComment = await prisma.productComment.create({
            data: { content, productId: parseInt(productId) },
        });
        res.status(201).json({ message: "댓글 등록완료", data: newComment });
    }))
    .get(asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const { cursor, pageSize } = req.query;
        const pageSizeNum = parseInt(pageSize) || 10;
        const findOptions = {
            where: { productId: parseInt(productId) },
            take: pageSizeNum,
            orderBy: { createdAt: 'desc' },
            select: { id: true, content: true, createdAt: true },
        };
        if (cursor) {
            findOptions.cursor = { id: parseInt(cursor) };
            findOptions.skip = 1;
        }
        const comments = await prisma.productComment.findMany(findOptions);
        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
        res.status(200).json({ data: comments, nextCursor });
    }));

router.route('/:productId/comments/:commentId')
    .patch(asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "수정할 내용을 입력하세요" });
        }
        const comment = await prisma.productComment.findUnique({ where: { id: parseInt(commentId) } });
        if (!comment) {
            return res.status(404).json({ message: "댓글을 찾을 수 없음" });
        }
        const updatedComment = await prisma.productComment.update({
            where: { id: parseInt(commentId) },
            data: { content },
        });
        res.status(200).json({ message: "댓글이 성공적으로 수정되었습니다.", data: updatedComment });
    }))
    .delete(asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        const comment = await prisma.productComment.findUnique({ where: { id: parseInt(commentId) } });
        if (!comment) {
            return res.status(404).json({ message: "댓글을 찾을 수 없음" });
        }
        await prisma.productComment.delete({ where: { id: parseInt(commentId) } });
        res.status(200).json({ message: "댓글 삭제완료", data: { id: parseInt(commentId) } });
    }));

export default router;
