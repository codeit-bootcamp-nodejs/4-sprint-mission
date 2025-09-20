import prisma from "../prisma.js";

export async function updateUserService({ id, updateData }) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("NOT_FOUND");
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  return updatedUser;
}
