import {
  getCommentListService,
  postCommentService,
  patchCommentService,
  deleteCommentService,
} from '../services/commentService.js';
// prettier-ignore
class CommentController {
  async getCommentList(req, res) {
    const parentType = req.parentType;
    const result = await getCommentListService({parentType, ...req.parsedQuery});
    return res.status(200).json(result);
  }
  async postComment(req, res) {
    const {content} = req.body;
    const parentType = req.parentType;
    const parentId = req.parentId;
    const {id: userId} = req.tokenPayload;
    const result = await postCommentService({parentId, userId, parentType, content});
    return res.status(201).json(result);
  }
  async patchComment(req, res) {
    const {content} = req.body;
    const id = req.parsedId;
    const result = await patchCommentService({id, content});
    return res.status(200).json(result);
  }
  async deleteComment(req, res) {
    const result = await deleteCommentService({id: req.parsedId});
    return res.status(200).json(result);
  }
}

export default new CommentController();
