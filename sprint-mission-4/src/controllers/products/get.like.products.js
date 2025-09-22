import prisma from "../../../lib/prisma.js";

export default async function getLikeProducts(req, res, next) {
  try {
    const product = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.user.id,
      },
      select: {
        likeProducts: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const result = product.likeProducts;
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
