import prisma from "../prisma.js";

export async function updateCommentService({ commentId, updateData }) {
  const id = commentId;
  const updated = await prisma.comment.update({
    where: { id },
    data: updateData,
  });
  return updated;
}
