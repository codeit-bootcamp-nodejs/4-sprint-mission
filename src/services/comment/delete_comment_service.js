import prisma from "../prisma.js";

export async function deleteCommentService({ commentId, user }) {
  const id = commentId;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== user.id) throw new Error("FORBIDDEN");
  await prisma.comment.delete({
    where: { id },
  });
}
