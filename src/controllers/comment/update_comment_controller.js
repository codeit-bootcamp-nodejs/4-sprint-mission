import { updateCommentService } from "../../services/comment/update_comment_service.js";

export async function updateCommentController(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;
    const updateData = {};

    if (content) updateData.content = content;
    const result = await updateCommentService({ id, updateData });
    res.send(result);
  } catch (e) {
    res.json({ message: e.message });
  }
}
