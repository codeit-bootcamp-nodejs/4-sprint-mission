import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCommentService({ id, take, cursor }) {
  const comment = await prisma.comment.findMany({
    where: { id },
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
  return comment;
}
