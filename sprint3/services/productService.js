import prisma from "../lib/prisma.js";

export const getProducts = async (offset, limit, name, description) => {
  const filter = [];

  if (name) {
    filter.push({ name: { contains: name } });
  }

  if (description) {
    filter.push({ description: { contains: description } });
  }

  const where = filter.length > 0 ? { OR: filter } : {};

  try {
    const product = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export const createProduct = async (name, description, price, tags) => {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export const findProductById = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
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
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (id, name, description, price, tags) => {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(tags !== undefined && { tags }),
      },
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export const removeProduct = async (id) => {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
};
