import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  listArticle,
  toggleArticleLike,
} from "../services/articleService.js";
import { DEFAULT_PAGE, MIN_PAGESIZE, MAX_PAGESIZE } from "../lib/constants.js";

export async function createArticleController(req, res, next) {
  try {
    const { title, content } = req.body;
    const articleData = { title, content, userId: req.user.id };
    const newArticle = await createArticle(articleData);
    res.status(201).json(newArticle);
  } catch (error) {
    next(error);
  }
}

export async function getArticleByIdController(req, res, next) {
  try {
    const id = req.params.id;
    const userId = req.user ? req.user.id : null;

    const article = await getArticleById(id);

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
}

export async function updateArticleController(req, res, next) {
  try {
    const id = req.params.id;

    // 기존 상품 조회
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 확인
    if (article.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    const { title, content } = req.body;
    const articleData = { title, content };
    const articlePatched = await updateArticle(id, articleData);
    res.status(200).json(articlePatched);
  } catch (error) {
    next(error);
  }
}

export async function deleteArticleController(req, res, next) {
  try {
    const id = req.params.id;

    // 기존 상품 조회
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 확인
    if (article.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    await deleteArticle(id);
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
}

export async function listArticleController(req, res, next) {
  try {
    const page = Math.max(req.query.page, DEFAULT_PAGE);
    const pageSize = Math.min(
      Math.max(req.query.pageSize, MIN_PAGESIZE),
      MAX_PAGESIZE
    );
    const keyword = req.query.keyword?.toString();
    const result = await listArticle({
      page,
      pageSize,
      keyword,
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
}

// 게시글 좋아요 또는 좋아요 취소 (toggle)
export async function toggleArticleLikeController(req, res, next) {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;

    // 서비스 함수 호출: 이미 좋아요 상태면 삭제, 아니면 생성 및 최신 데이터 다시 가져오기 (좋아요 개수 + 내가 눌렀는지)
    const result = await toggleArticleLike(userId, articleId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
