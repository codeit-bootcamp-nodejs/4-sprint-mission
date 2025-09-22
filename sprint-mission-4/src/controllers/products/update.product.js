import prisma from "../../../lib/prisma.js";

const updateProduct = async (req, res, next) => {
  const reqId = Number(req.params.id);

  try {
    const product = await prisma.product.update({
      where: { id: reqId, ownerId: req.user.id },
      data: req.body,
    });

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

export default updateProduct;
