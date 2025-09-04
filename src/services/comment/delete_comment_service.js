import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteCommentService(id) {
  await prisma.comment.delete({
    where: { id },
  });
}
