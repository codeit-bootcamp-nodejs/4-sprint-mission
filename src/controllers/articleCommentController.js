import {
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
  listArticleComment,
  getArticleCommentById,
} from "../services/articleCommentService.js";

export async function createArticleCommentController(req, res, next) {
  try {
    const articleId = req.params.articleId;

    const { content } = req.body;
    const articleCommentData = { content, articleId, userId: req.user.id };
    const articleComment = await createArticleComment(articleCommentData);
    res.status(201).json(articleComment);
  } catch (error) {
    next(error);
  }
}

export async function updateArticleCommentController(req, res, next) {
  try {
    const commentId = req.params.commentId;

    // 기존 댓글 조회
    const comment = await getArticleCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    const { content } = req.body;

    const atcCommentPatched = await updateArticleComment(commentId, {
      content,
    });
    res.status(200).json(atcCommentPatched);
  } catch (error) {
    next(error);
  }
}

export async function deleteArticleCommentController(req, res, next) {
  try {
    const commentId = req.params.commentId;

    // 기존 댓글 조회
    const comment = await getArticleCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    await deleteArticleComment(commentId);
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
}

export async function listArticleCommentController(req, res, next) {
  try {
    const articleId = req.params.articleId;

    const cursor = req.query.cursor;
    const limit = req.query.limit;

    const articleComments = await listArticleComment(articleId, {
      cursor,
      limit,
    });
    res.status(200).json({
      comments: articleComments,
      nextCursor:
        articleComments.length > 0
          ? articleComments[articleComments.length - 1].createdAt
          : null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getArticleCommentByIdController(req, res, next) {
  try {
    const commentId = req.params.commentId;
    const articleComment = await getArticleCommentById(commentId);
    if (!articleComment) {
      return res
        .status(404)
        .json({ error: `${commentId}에 해당하는 댓글을 찾을 수 없습니다` });
    }

    res.status(200).json(articleComment);
  } catch (error) {
    next(error);
  }
}
