import express from "express";
import auth from '../middlewares/auth.js'
import prisma from '../lib/prisma.js'

const router = express.Router();

// [POST] 게시글 등록
router.post("/",auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "제목과 내용을 모두 입력해주세요." });
        }

        const newArticle = await prisma.article.create({
            data: { title, content },
        });

        return res.status(201).json({
            message: "게시글이 성공적으로 등록되었습니다.",
            article: newArticle,
        });
    } catch (err) {
        console.error("게시글 등록 오류:", err);
        return res.status(500).json({ message: "게시글 등록 실패", error: err.message });
    }
});

// [GET] 게시글 상세 조회
router.get("/:id", async(req, res) => {
    try {
        const articleId = parseInt(req.params.id, 10);

        if (isNaN(articleId)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }
        
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: { id: true, title: true, content: true, createdAt: true },
        });

        if (!article) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다."});
        }

        return res.status(200).json(article);
    } catch (err) {
        console.error("게시글 조회 오류", err);
        return res.status(500).json({ message: "게시글 조회 실패", error: err.message });
    }
});

// [PATCH] 게시글 수정
router.patch("/:id", auth, async(req, res) => {
    try {
        const articleId = parseInt(req.params.id, 10);
        const {title, content} = req.body;

        if (isNaN(articleId)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }
        
        const existingArticle = await prisma.article.findUnique({ where : {id: articleId }});
        if (!existingArticle) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        const updatedArticle = await prisma.article.update({
            where: { id: articleId },
            data: {
                title: title ?? existingArticle.title,
                content: content ?? existingArticle.content,
            },
        });

        return res.status(200).json({
            message: "게시글이 수정되었습니다",
            article: updatedArticle,
        });
    } catch(err) {
        console.error("개시글 수정 오류: ", err);
        return res.status(500).json({ message: "게시글 수정 실패", error: err.message });
    }
});

// [DELETE] 게시글 삭제
router.delete("/:id", auth, async(req, res) => {
    try {
        const articleId = parseInt(req.params.id, 10);

        if (isNaN(articleId)) {
            return res.status(404).json({ message : "유효하지 않은 ID입니다." });
        }

        const article = await prisma.article.findUnique({ where: { id: articleId }});
        if (!article) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다."});
        }

        await prisma.article.delete({ where: { id: articleId }});

        return res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다."});
    } catch (err) {
        console.error("게시글 삭제 오류", err);
        return res.status(500).json({ message: "게시글 삭제 실패", error: err.message });
    }
});

// [GET] 게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const { offset = 0, limit = 10, search = "", sort = "recent" } = req.query;

    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderOption = sort === "recent" ? { createdAt: "desc" } : {};

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: whereCondition,
        select: { id: true, title: true, content: true, createdAt: true },
        orderBy: orderOption,
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.article.count({ where: whereCondition }),
    ]);

    return res.status(200).json({
      totalCount,
      offset: Number(offset),
      limit: Number(limit),
      articles,
    });
  } catch (err) {
    console.error("게시글 목록 조회 오류:", err);
    return res.status(500).json({ message: "게시글 목록 조회 실패", error: err.message });
  }
});

export default router;