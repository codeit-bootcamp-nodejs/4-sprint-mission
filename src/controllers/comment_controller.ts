import { Request, Response } from "express";
import {
  createArticleCommentService,
  createProductCommentService,
  deleteCommentService,
  getArticleCommentService,
  getProductCommentService,
  updateCommentService,
} from "../services/comment_service";
import { AppError } from "../utils/error";

interface CommentParam {
  id: string;
}

interface DeleteParam {
  commentId: string;
}

interface CommentQuery {
  take: string;
  cursor: string;
}

export async function createArticleCommentController(
  req: Request<CommentParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await createArticleCommentService({ id, content, user });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: "댓글 작성에 실패했습니다." });
  }
}

export async function createProductCommentController(
  req: Request<CommentParam>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await createProductCommentService({ id, content, user });
    res.status(201).json(result);
  } catch (e) {
    res.json({ message: "댓글 작성에 실패했습니다." });
  }
}
export async function deleteCommentController(
  req: Request<DeleteParam>,
  res: Response
) {
  try {
    const commentId = parseInt(req.params.commentId);
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    await deleteCommentService({ commentId, user });
    res.send("success");
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "댓글 삭제를 실패했습니다." });
    }
  }
}

export async function getArticleCommentController(
  req: Request<CommentParam, {}, {}, CommentQuery>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const take = parseInt(req.query.take) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    const result = await getArticleCommentService({ id, take, cursor });
    res.json(result);
  } catch (e) {
    res.json({ message: "댓글 조회에 실패했습니다." });
  }
}

export async function getProductCommentController(
  req: Request<CommentParam, {}, {}, CommentQuery>,
  res: Response
) {
  try {
    const id = parseInt(req.params.id);
    const take = parseInt(req.query.take) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    const result = await getProductCommentService({ id, take, cursor });
    res.json(result);
  } catch (e) {
    res.json({ message: "댓글 조회에 실패했습니다." });
  }
}

export async function updateCommentController(
  req: Request<DeleteParam, {}, Comment.Update["content"]>,
  res: Response
) {
  try {
    const commentId = parseInt(req.params.commentId);
    const user = req.user;
    const content = req.body;
    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const result = await updateCommentService({ commentId, content, user });
    res.send(result);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.statusCode).json({ message: e.message });
    } else {
      res.status(500).json({ message: "댓글 수정에 실패했습니다." });
    }
  }
}
