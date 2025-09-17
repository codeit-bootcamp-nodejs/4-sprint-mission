import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  listArticle,
  toggleArticleLike,
} from "../services/articleService.js";
import { DEFAULT_PAGE, MIN_PAGESIZE, MAX_PAGESIZE } from "../lib/constants.js";
import type {
  CreateArticleController,
  GetArticleByIdController,
  UpdateArticleController,
  DeleteArticleController,
  ListArticleController,
  ToggleArticleLikeController,
} from "../types/controller/article.controller.types.js";

export const createArticleController: CreateArticleController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const data = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    };
    const newArticle = await createArticle(data);
    res.status(201).json(newArticle);
  } catch (error) {
    next(error);
  }
};

export const getArticleByIdController: GetArticleByIdController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const userId = req.user.id;

    const article = await getArticleById({ id });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const response = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      user: article.User,
      likeCount: article._count.articleLikes,
      isLiked: userId
        ? article.articleLikes.some((like) => like.userId === userId)
        : false,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateArticleController: UpdateArticleController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    // 기존 상품 조회
    const article = await getArticleById({ id });
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 확인
    if (article.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    const data = { id, title: req.body.title, content: req.body.content };
    const articlePatched = await updateArticle(data);
    res.status(200).json(articlePatched);
  } catch (error) {
    next(error);
  }
};

export const deleteArticleController: DeleteArticleController = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    // 기존 상품 조회
    const article = await getArticleById({ id });
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 확인
    if (article.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    await deleteArticle({ id });
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};

export const listArticleController: ListArticleController = async (
  req,
  res,
  next
) => {
  try {
    const page = Math.max(Number(req.query.page) ?? DEFAULT_PAGE, DEFAULT_PAGE);
    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) ?? MIN_PAGESIZE, MIN_PAGESIZE),
      MAX_PAGESIZE
    );
    const rawKeyword = req.query.keyword;

    const keywordArray = rawKeyword
      ? Array.isArray(rawKeyword)
        ? rawKeyword.map(String)
        : [String(rawKeyword)]
      : undefined;

    const result = await listArticle({
      page,
      pageSize,
      ...(keywordArray ? { keyword: keywordArray } : {}),
    });

    const response = {
      data: result.data,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
        hasNextPage: result.page * result.pageSize < result.total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// 게시글 좋아요 또는 좋아요 취소 (toggle)
export const toggleArticleLikeController: ToggleArticleLikeController = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    const data = { userId: req.user.id, id: Number(req.params.id) };

    // 서비스 함수 호출: 이미 좋아요 상태면 삭제, 아니면 생성 및 최신 데이터 다시 가져오기 (좋아요 개수 + 내가 눌렀는지)
    const result = await toggleArticleLike(data);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
