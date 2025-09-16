import { prisma } from "../prisma/client.js";
import { CreateCommentDto } from "../validations/schemas.js";

// 상품 댓글 등록
export async function createProductComment(req, res) {
  const body = CreateCommentDto.parse(req.body);
  const productId = parseInt(req.params.productId);

  const comment = await prisma.productComment.create({
    data: { content: body.content, userId: req.user.id, productId },
  });
  return res.status(201).json(comment);
}

// 게시글 댓글 등록
export async function createPostComment(req, res) {
  const body = CreateCommentDto.parse(req.body);
  const postId = parseInt(req.params.postId);

  const comment = await prisma.postComment.create({
    data: { content: body.content, userId: req.user.id, postId },
  });
  return res.status(201).json(comment);
}

// 댓글 수정
export async function updateComment(req, res) {
  const id = parseInt(req.params.id);
  const body = CreateCommentDto.parse(req.body);

  const comment = await prisma.comment.update({ where: { id }, data: { content: body.content } });
  return res.json(comment);
}

// 댓글 삭제
export async function deleteComment(req, res) {
  const id = parseInt(req.params.id);
  await prisma.comment.delete({ where: { id } });
  return res.json({ message: "삭제되었습니다." });
}
