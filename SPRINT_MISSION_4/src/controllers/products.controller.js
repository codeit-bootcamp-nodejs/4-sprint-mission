import { prisma } from "../prisma/client.js";
import { CreateProductDto, UpdateProductDto } from "../validations/schemas.js";

export async function createProduct(req, res) {
  const body = CreateProductDto.parse(req.body);
  const product = await prisma.product.create({
    data: { ...body, userId: req.user.id },
  });
  return res.status(201).json(product);
}

export async function listProducts(req, res) {
  const products = await prisma.product.findMany({ include: { user: true } });
  return res.json(products);
}

export async function getProduct(req, res) {
  const id = parseInt(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      user: true,
      likes: { where: { userId: req.user?.id } },
    },
  });
  if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

  return res.json({
    ...product,
    isLiked: product.likes.length > 0,
  });
}

export async function updateProduct(req, res) {
  const id = parseInt(req.params.id);
  const body = UpdateProductDto.parse(req.body);
  const product = await prisma.product.update({
    where: { id },
    data: body,
  });
  return res.json(product);
}

export async function deleteProduct(req, res) {
  const id = parseInt(req.params.id);
  await prisma.product.delete({ where: { id } });
  return res.json({ message: "삭제되었습니다." });
}
