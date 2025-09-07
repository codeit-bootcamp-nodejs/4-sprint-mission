import prisma from "../prisma.js";

export async function updateCommentService({ commentId, updateData, user }) {
  const id = commentId;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== user.id) throw new Error("FORBIDDEN");
  const updated = await prisma.comment.update({
    where: { id },
    data: { updateData, userId: user.id },
  });
  return updated;
}
