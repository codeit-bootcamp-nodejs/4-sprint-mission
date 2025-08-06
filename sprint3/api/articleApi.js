import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.post("/articles", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "필수 항목 누락" });
  }

  try {
    const articles = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(articles);
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/articles/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

app.patch("/articles/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  try {
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
    });

    res.status(200).json(article);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(500).json({ message: "서버 에러" });
  }
});

app.delete("/articles/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.article.delete({ where: { id } });

    res.status(200).json({ message: `${id} 삭제 완료` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/article", async (req, res) => {
  const { offset = 0, limit = 10, search } = req.query;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  try {
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});
