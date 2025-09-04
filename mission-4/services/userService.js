import prisma from "../lib/prisma.js";

async function getUserService({ id }) {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      Image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
}
async function patchUserService({ id, data }) {
  const result = await prisma.user.update({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      Image: true,
      createdAt: true,
      updatedAt: true,
    },
    data,
  });
  return result;
}
async function deleteUserService({ id }) {
  const result = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      Image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
}
async function getUserContentListService({ id, content }) {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      [content]: true,
    },
  });
  return result;
}

export { getUserService, patchUserService, deleteUserService, getUserContentListService };
