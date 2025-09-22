import prisma from "../../../lib/prisma.js";

const getProductDetail = async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: reqId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,

        likedUsers: {
          where: { id: req.user.id },
        },
      },
    });

    const isLiked = product.likedUsers.length > 0;

    const result = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      isLiked: isLiked,
      createdAt: product.createdAt,
    };

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default getProductDetail;
