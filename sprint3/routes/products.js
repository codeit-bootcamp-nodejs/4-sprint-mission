import express from "express";
import { PrismaClient } from "@prisma/client";
import commentRouter from "./productComments.js";

const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

router.post("/", async (req, res) => {
  const { name, description, price, tags } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: "tags는 문자열 배열이어야 합니다." });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "서버 에러" });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "서버 에러" });
  }
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, tags } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(tags !== undefined && { tags }),
      },
    });

    res.status(200).json(product);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.status(500).json({ error: "서버 에러" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: `${id} 삭제 완료` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.status(500).json({ error: "서버 에러" });
  }
});

router.get("/", async (req, res) => {
  const { offset = 0, limit = 10, name, description } = req.query;

  const filter = [];

  if (name) {
    filter.push({ name: { contains: name } });
  }

  if (description) {
    filter.push({ description: { contains: description } });
  }

  const where = filter.length > 0 ? { AND: filter } : {};

  try {
    const product = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "서버 에러" });
  }
});

router.use("/", commentRouter);

export default router;
