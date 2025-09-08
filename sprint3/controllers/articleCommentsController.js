import {
  createArticleComment,
  findArticleComments,
  removeArticleComment,
  updateArticleComment,
} from "../services/articleCommentsService.js";

export const getArticleComments = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { cursor, limit = 10 } = req.query;

    const aritcleComments = await findArticleComments(articleId, cursor, limit);

    if (aritcleComments.length === 0) {
      return res
        .status(400)
        .json({ message: "선택한 범위 내 댓글을 찾을 수 없습니다." });
    }

    res.status(200).json(aritcleComments);
  } catch (err) {
    next(err);
  }
};

export const postArticleComment = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const userId = Number(req.user.id);
    const { content } = req.body;

    const comment = await createArticleComment(articleId, content, userId);

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const patchArticleComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const articleId = Number(req.params.articleId);
    const userId = Number(req.user.id);
    const { content } = req.body;

    const comment = await updateArticleComment(
      articleId,
      commentId,
      content,
      userId
    );

    res.status(200).json(comment);
  } catch (err) {
    if (err.message === "댓글을 찾을 수 없습니다.") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

export const deleteArticleComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const articleId = Number(req.params.articleId);
    const userId = Number(req.user.id);

    await removeArticleComment(commentId, articleId, userId);

    res.status(200).json({ message: `ID:${commentId} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
