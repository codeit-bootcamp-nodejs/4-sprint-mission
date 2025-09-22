import prisma from "../../../lib/prisma.js";

const updateArticle = async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    const result = await prisma.article.update({
      where: { id: reqId, ownerId: req.user.id },
      data: req.body,
    });

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default updateArticle;
