import * as commentRepo from "../repository/comment_repository";

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
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== user.id) throw new Error("FORBIDDEN");
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
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== user.id) throw new Error("FORBIDDEN");
  const updated = await commentRepo.updateCommentRepo({
    commentId,
    content,
    user,
  });
  return updated;
}
