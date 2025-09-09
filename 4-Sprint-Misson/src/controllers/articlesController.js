import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ArticlesController {
  // 게시글 등록
  async create(req, res) {
    const { title, content } = req.body;
    const userId = req.user.id; // 로그인 유저 ID

    try {
      if (!title || !content) {
        return res.status(400).json({ error: "제목/내용 누락" });
      }

      const article = await prisma.article.create({
        data: { title, content, userId },
      });

      res.status(201).json(article);
    } catch (err) {
      res.status(500).json({ error: "게시글 등록 오류" });
    }
  }

  // 게시글 상세 조회
  async getById(req, res) {
    const id = Number(req.params.id);

    try {
      const article = await prisma.article.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, email: true } },
        },
      });

      if (!article) return res.status(404).json({ error: "게시글 없음" });
      res.status(200).json(article);
    } catch (err) {
      res.status(500).json({ error: "조회 오류" });
    }
  }

  // 게시글 수정
  async update(req, res) {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    try {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) return res.status(404).json({ error: "게시글 없음" });

      if (article.userId !== req.user.id) {
        return res.status(403).json({ error: "권한 없음" });
      }

      const updated = await prisma.article.update({
        where: { id },
        data: { title, content },
      });

      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: "수정 오류" });
    }
  }

  // 게시글 삭제
  async delete(req, res) {
    const id = Number(req.params.id);

    try {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) return res.status(404).json({ error: "게시글 없음" });

      if (article.userId !== req.user.id) {
        return res.status(403).json({ error: "권한 없음" });
      }

      await prisma.article.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "삭제 오류" });
    }
  }

  // 게시글 목록 조회 (최신순, 검색 포함)
  async list(req, res) {
    const {
      page = 1,
      pageSize = 10,
      sort = "recent",
      search = "",
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    try {
      const where = {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      };

      const articles = await prisma.article.findMany({
        where,
        orderBy: { createdAt: sort === "recent" ? "desc" : "asc" },
        skip,
        take,
        select: {
          id: true,
          title: true,
          createdAt: true,
          user: { select: { id: true, email: true } },
        },
      });

      const total = await prisma.article.count({ where });

      res.status(200).json({
        data: articles,
        pagination: {
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (err) {
      res.status(500).json({ error: "목록 조회 오류" });
    }
  }
}