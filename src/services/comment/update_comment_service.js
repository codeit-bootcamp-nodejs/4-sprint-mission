import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateCommentService({ commentId, updateData }) {
  const id = commentId;
  const updated = await prisma.comment.update({
    where: { id },
    data: updateData,
  });
  return updated;
}
