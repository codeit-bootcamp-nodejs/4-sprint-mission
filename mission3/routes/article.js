import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

// 상품 등록 (Create)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, tags }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "상품 등록 실패!" });
  }
});

// 상품 상세 조회 (Read)
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (!product) return res.status(404).json({ error: "상품 없음" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "상세 조회 실패" });
  }
});

// 상품 수정 (Update)
router.patch("/:id", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, description, price, tags, updatedAt: new Date() }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "수정 실패" });
  }
});

// 상품 삭제 (Delete)
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: "삭제 실패" });
  }
});

// 상품 목록 조회 (검색/페이징 포함)
router.get("/", async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(perPage)
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: "목록 조회 실패" });
  }
});

export default router;
