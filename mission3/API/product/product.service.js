import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUniqueProductById = async (id) => {
  return await prisma.product.findUnique({where:{id}});
};
