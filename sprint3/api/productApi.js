import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.post("/", async (req, res) => {
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

app.get("/products/:id", async (req, res) => {
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

app.patch("/products/:id", async (req, res) => {
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

app.delete("/products/:id", async (req, res) => {
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

app.get("/products", async (req, res) => {
  const { offset = 0, limit = 10, search } = req.query;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insenstive" } },
          { description: { contains: search, mode: "insenstive" } },
        ],
      }
    : {};

  try {
    const product = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        price: true,
        createAt: true,
      },
    });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "서버 에러" });
  }
});
