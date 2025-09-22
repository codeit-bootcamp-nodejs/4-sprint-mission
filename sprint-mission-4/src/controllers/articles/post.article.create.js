import prisma from "../../../lib/prisma.js";

const createArticle = async (req, res, next) => {
  try {
    const reqId = Number(req.params.id);

    const result = await prisma.article.create({
      data: {
        ...req.body,
        owner: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default createArticle;
