import {
  getArticleCommentService,
  getProductCommentService,
} from "../../services/comment/get_comment_service.js";

export async function getArticleCommentController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const take = parseInt(req.query.take) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    const result = await getArticleCommentService({ id, take, cursor });
    res.json(result);
  } catch (e) {
    res.json({ message: "댓글 조회에 실패했습니다." });
  }
}

export async function getProductCommentController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const take = parseInt(req.query.take) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    const result = await getProductCommentService({ id, take, cursor });
    res.json(result);
  } catch (e) {
    res.json({ message: "댓글 조회에 실패했습니다." });
  }
}
