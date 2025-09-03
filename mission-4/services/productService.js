import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProductListService({ keyword, page, pageSize }) {
  const productList = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
  return productList;
}

async function postProductService({ name, description, price, tags }) {
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
    },
  });
  return product;
}

async function getProductService({ id }) {
  const product = await prisma.product.findUniqueOrThrow({
    where: id,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });
  return product;
}

async function patchProductService({ id, data }) {
  const product = await prisma.product.update({
    where: id,
    data,
  });
  return product;
}

async function deleteProductService({ id }) {
  const product = await prisma.product.delete({
    where: id,
  });
  return product;
}

export {
  getProductListService,
  postProductService,
  getProductService,
  patchProductService,
  deleteProductService,
};
