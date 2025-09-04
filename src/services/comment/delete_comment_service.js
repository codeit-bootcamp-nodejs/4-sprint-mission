import prisma from "../prisma.js";

export async function deleteCommentService(commentId) {
  const id = commentId;
  await prisma.comment.delete({
    where: { id },
  });
}
