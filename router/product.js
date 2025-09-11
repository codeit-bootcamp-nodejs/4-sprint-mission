import express from "express";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, InternalServerError } from "../middleware/error.js";

const prisma = new PrismaClient();
const router = express.Router();

// 유효성 검사
import { validateProduct } from "../middleware/validate.js";

// 상품 등록 + 목록 조회
router
  .route("/")
  .post(validateProduct, async (req, res) => {
    try {
      const { name, description, price, tags } = req.body;
      const product = await prisma.product.create({
        data: { name, description, price, tags },
      });
      res.status(201).json(product);
    } catch (e) {
      next(new InternalServerError("상품 등록에 실패했습니다."));
    }
  })
  .get(async (req, res) => {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search?.toString() || "";

      const product = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });

      if (!product)
        return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
      res.send(product);
    } catch (e) {
      next(new InternalServerError("상품 목록 조회에 실패했습니다."));
    }
  });

// 상품 상세 조회 + 수정 + 삭제
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
      });

      if (!product) next(new BadRequestError("상품을 찾을 수 없습니다."));
      res.send(product);
    } catch (e) {
      next(new InternalServerError("상품 상세 조회를 실패했습니다."));
    }
  })
  .patch(validateProduct, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, price, tags } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = price;
      if (tags) updateData.tags = tags;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });
      res.send(product);
    } catch (e) {
      next(new InternalServerError("상품 수정에 실패했습니다."));
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.product.delete({
        where: { id },
      });
      res.sendStatus(204);
    } catch (e) {
      next(new InternalServerError("상품 삭제에 실패했습니다."));
    }
  });

export default router;
