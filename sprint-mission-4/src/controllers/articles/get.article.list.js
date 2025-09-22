import prisma from "../../../lib/prisma.js";

const getArticleList = async (req, res) => {
  const {
    offset = 0,
    limit = 10,
    order = "recent",
    title = "",
    content = "",
  } = req.query;

  let sort;
  if (order == "recent") sort = "desc";
  else if (order == "lastest") sort = "asc";
  else sort = "desc;";

  const resultes = await prisma.article.findMany({
    where: {
      title: { contains: title },
      content: { contains: content },
    },
    skip: Number(offset),
    take: Number(limit),
    orderBy: {
      updateAt: sort,
    },
  });

  res.status(200).send(resultes);
};

export default getArticleList;
