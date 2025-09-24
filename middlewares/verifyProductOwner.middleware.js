import prisma from "../prisma/prisma.js";

export async function verifyProductOwner(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product  = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다."});
    }

    if (product.userId !== userId) {
      return res.status(403).json({ message: "상품을 수정할 권한이 없습니다." });
    }

    next();
  } catch (err) {
    next(err);
  }
}