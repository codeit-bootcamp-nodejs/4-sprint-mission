import prisma from "../../../lib/prisma.js";

const getArticleDetail = async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: reqId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likedUsers: {
          where: {
            id: req.user.id,
          },
        },
      },
    });

    const isLiked = article.likedUsers.length > 0;

    const result = {
      id: article.id,
      name: article.title,
      description: article.content,
      isLiked: isLiked,
      createdAt: article.createdAt,
    };

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default getArticleDetail;
