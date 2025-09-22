import prisma from "../../../lib/prisma.js";

const getArticleComment = async (req, res) => {
  const reqId = Number(req.params.id);
  const cursor = 1;

  if (req.query.cursor) cursor = req.query.cursor;

  const result = await prisma.article.findMany({
    where: {
      id: reqId,
    },
    select: {
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    cursor: { id: cursor },
    take: 10,
  });
  res.status(200).send(result);
};

export default getArticleComment;
