import {
  createArticleCommentService,
  createProductCommentService,
} from "../../services/comment/create_comment_service.js";

export async function createCommentController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    const result = await createArticleCommentService({ id, content });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: "댓글 작성에 실패했습니다." });
  }
}
