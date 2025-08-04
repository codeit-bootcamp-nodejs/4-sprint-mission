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
