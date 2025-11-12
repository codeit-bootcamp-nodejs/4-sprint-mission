import * as commentRepo from "../repository/comment_repository";
import { createNotificationService } from "./notification_service";
import { AppError } from "../utils/error";

export async function createArticleCommentService({
  id,
  content,
  user,
}: Comment.Create) {
  const comment = await commentRepo.createArticleCommentRepo({
    id,
    content,
    user,
  });
  const author = await commentRepo.findArticleAuthor(id);
  const message = "새로운 댓글이 달렸습니다.";
  await createNotificationService(author!.userId!, message);

  return comment;
}

export async function createProductCommentService({
  id,
  content,
  user,
}: Comment.Create) {
  const comment = await commentRepo.createProductCommentRepo({
    id,
    content,
    user,
  });
  return comment;
}

export async function deleteCommentService({
  commentId,
  user,
}: Comment.Delete) {
  const id = commentId;
  const comment = await commentRepo.findUniqueRepo(id);
  if (!comment) throw new AppError("존재하지 않는 댓글입니다.", 404);
  if (comment.userId !== user.id) throw new AppError("권한이 없습니다.", 403);
  await commentRepo.deleteCommentRepo(id);
}

export async function getArticleCommentService({
  id,
  take,
  cursor,
}: Comment.Get) {
  const comment = await commentRepo.getArticleRepo({ id, take, cursor });
  return comment;
}

export async function getProductCommentService({
  id,
  take,
  cursor,
}: Comment.Get) {
  const comment = await commentRepo.getProductRepo({ id, take, cursor });
  return comment;
}

export async function updateCommentService({
  commentId,
  content,
  user,
}: Comment.Update) {
  const id = commentId;
  const comment = await commentRepo.findUniqueRepo(id);
  if (!comment) throw new AppError("존재하지 않는 댓글입니다.", 404);
  if (comment.userId !== user.id) throw new AppError("권한이 없습니다.", 403);
  const updated = await commentRepo.updateCommentRepo({
    commentId,
    content,
    user,
  });
  return updated;
}
