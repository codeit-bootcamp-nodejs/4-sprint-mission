import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateId,
  validateCommentId,
  validateProductData,
  validateCommentData,
  validateProductUpdateData,
} from './validation.js';

const router = express.Router();
const prisma = new PrismaClient();

// 상품 목록 조회 API
router
  .route('/')
  .get(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // 페이지
    const limit = parseInt(req.query.limit) || 10; // 노출 항목
    const sort = req.query.sort || 'recent'; // 정렬 설정
    const keyword = req.query.keyword || ''; // 키워드 설정
    const skip = (page - 1) * limit; // 넘길 항목수

    let orderBy;
    switch (sort) {
      case 'resect':
        orderBy = { createdAt: 'desc' };
        break;
      case 'old':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    let where = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      where, // 검색 조건 적용
      orderBy, // 정렬 조건 적용
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
    const totalProducts = await prisma.product.count({ where }); // 검색 조건에 맞는 총 상품 수
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  })
  // 상품 등록 API
  .post(validateProductData, async (req, res) => {
    const { name, description, price, tags } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });
    res.status(201).json(newProduct);
  });

// 상품 상세 조회 API
router
  .route('/:id')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return res.status(404).json({ message: '존재하지 않는 상품입니다.' });
    }
    res.status(200).json(product);
  })
  // 상품 수정 API
  .patch(validateId, validateProductUpdateData, async (req, res) => {
    const { id } = req.params;
    const { updateData } = req.body;
    const updateProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.status(200).json(updateProduct);
  })
  // 상품 삭제 API
  .delete(validateId, async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  });
// 댓글

// 댓글 목록 조회, 생성
router
  .route('/:id/comments')
  .get(validateId, async (req, res) => {
    const { id } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        productId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(comments);
  })
  .post(validateId, validateCommentData, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        content,
        product: {
          connect: { id: parseInt(id) },
        },
      },
    });
    res.status(201).json(newComment);
  });
// 댓글 상세조회, 수정, 삭제
router
  .route('/:id/comments/:commentId')
  .get(validateId, validateCommentId, async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        productId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(comment);
  })
  .patch(validateCommentId, validateCommentData, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const updateComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    res.status(200).json(updateComment);
  })
  .delete(validateCommentId, async (req, res) => {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res.status(204).send();
  });

export default router;
