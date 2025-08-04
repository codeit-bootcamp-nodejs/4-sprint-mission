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
