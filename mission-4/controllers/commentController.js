import {
  getCommentListService,
  postCommentService,
  patchCommentService,
  deleteCommentService,
} from "../services/commentService.js";
// prettier-ignore
class CommentController {
  async getCommentList(req, res) {
    const args = {
        ...req.parsedQuery,
        parentType: req.parentType
    }
    const result = await getCommentListService(args);
    return res.status(200).json(result);
  }
  async postComment(req, res) {
    const {content} = req.body;
    const args = {
        parentId: req.parentId,
        parentType: req.parentType,
        userId: req.user.id,
        content,
    }
    const result = await postCommentService(args);
    return res.status(201).json(result);
  }
  async patchComment(req, res) {
    const {content} = req.body;
    const args = {
        id: req.parsedId,
        content,
    }
    const result = await patchCommentService(args);
    return res.status(200).json(result);
  }
  async deleteComment(req, res) {
    const args = {
        id: req.parsedId
    }
    const result = await deleteCommentService(args);
    return res.status(200).json(result);
  }
}

export default new CommentController();
