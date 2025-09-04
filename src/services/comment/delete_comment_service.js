import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteCommentService(commentId) {
  const id = commentId;
  await prisma.comment.delete({
    where: { id },
  });
}
