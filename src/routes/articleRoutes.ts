import express from "express";
import type {Request, Response} from "express";
import auth from '../../src/middlewares/auth.js'
import prisma from '../lib/prisma.js'

const router = express.Router();

// [POST] 게시글 등록
router.post("/", auth, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, content } = req.body as { title?: string; content?: string };

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
  } catch (err: any) {
    console.error("게시글 등록 오류:", err);
    return res.status(500).json({ message: "게시글 등록 실패", error: err.message });
  }
});

// [GET] 게시글 상세 조회
router.get("/:id", async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id가 없습니다."})
  }

  try {
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    return res.status(200).json(article);
  } catch (err: any) {
    console.error("게시글 조회 오류:", err);
    return res.status(500).json({ message: "게시글 조회 실패", error: err.message });
  }
});


// [PATCH] 게시글 수정
router.patch("/:id", auth, async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id가 없습니다."})
  }

  try {
    const articleId = parseInt(id, 10);
    const { title, content } = req.body as { title?: string; content?: string };

    if (isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }

    const existingArticle = await prisma.article.findUnique({ where: { id: articleId } });
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
  } catch (err: any) {
    console.error("게시글 수정 오류: ", err);
    return res.status(500).json({ message: "게시글 수정 실패", error: err.message });
  }
});

// [DELETE] 게시글 삭제
router.delete("/:id", auth, async (req: Request, res: Response): Promise<Response> => {
  
  const {id} = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id가 없습니다."})
  }

  try {
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    await prisma.article.delete({ where: { id: articleId } });

    return res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (err: any) {
    console.error("게시글 삭제 오류:", err);
    return res.status(500).json({ message: "게시글 삭제 실패", error: err.message });
  }
});

interface ListQuery {
  offset?: string;
  limit?: string;
  search?: string;
  sort?: string;
}

// [GET] 게시글 목록 조회
router.get("/", async (req: Request<{}, {}, {}, ListQuery>, res: Response) => {
  try {
    const offset = Number(req.query.offset ?? 0);
    const limit = Number(req.query.limit ?? 10);
    const search = (req.query.search as string) ?? "";
    const sort = (req.query.sort as string) ?? "recent";

    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderOption = sort === "recent" ? { createdAt: "desc" as const } : {};

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: whereCondition,
        select: { id: true, title: true, content: true, createdAt: true },
        orderBy: orderOption,
        skip: offset,
        take: limit,
      }),
      prisma.article.count({ where: whereCondition }),
    ]);

    return res.status(200).json({
      totalCount,
      offset,
      limit,
      articles,
    });
  } catch (err: any) {
    console.error("게시글 목록 조회 오류:", err);
    return res.status(500).json({ message: "게시글 목록 조회 실패", error: err.message });
  }
});

export default router;