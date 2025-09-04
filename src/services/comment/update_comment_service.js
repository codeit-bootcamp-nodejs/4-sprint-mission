import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateCommentService({ id, content }) {
  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
  });
  return updated;
}
