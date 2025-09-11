import { Prisma } from '@prisma/client';
import { validatePassword, passwordHashing } from '../lib/bcrypt.js';
import { UnauthorizedError } from '../lib/errors.js';
import prisma from '../lib/prisma.js';
import { EntityId, PatchUserData, getUserContent } from '../types/user.types.js';
// 이거 빨간줄 gemini 물어보고 경로들 tsconfig에서 @로 좀 깔끔하게 만들자

async function getUserService({ id }: EntityId) {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
}
async function patchUserService({ id, data }: PatchUserData) {
  const { changePassword, currentPassword, image, ...restData } = data;
  const updateData: Prisma.UserUpdateInput = { ...restData };
  if (image) {
    updateData.image = {
      connect: {
        url: image,
      },
    };
  }
  if (changePassword && currentPassword) {
    // 비밀번호 변경시에만 실행
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        password: true,
      },
    });
    if (await validatePassword(currentPassword, user.password)) {
      updateData['password'] = await passwordHashing(changePassword);
    } else {
      throw new UnauthorizedError('현재 비밀번호가 일치하지 않습니다.');
    }
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
    data: updateData,
  });
  return result;
}
async function deleteUserService({ id }: EntityId) {
  const result = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
}
async function getUserContentListService({ id, content }: getUserContent) {
  content += 's';
  let options = {};
  if (content === 'comments') {
    options = {
      select: {
        [content]: true,
      },
    };
  } else {
    options = {
      select: {
        [content]: {
          include: {
            _count: { select: { likes: true } },
            likes: { where: { userId: id } },
          },
        },
      },
    };
  }
  const userContent = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    ...options,
  });
  let result = userContent;
  if (content === 'products' || content === 'articles') {
    const contentList = userContent[content];
    const filteredContentList = contentList.map((content) => {
      const { likes, _count, ...filteredContent } = content;
      return {
        likeCount: content._count.likes,
        isLike: id ? content.likes.length === 1 : false,
        ...filteredContent,
      };
    });
    result = filteredContentList;
  }
  return result;
}
async function getUserContentLikeListService({ id, content }) {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      [`${content}Likes`]: {
        include: {
          [content]: true,
        },
      },
    },
  });
  return result;
}

export {
  getUserService,
  patchUserService,
  deleteUserService,
  getUserContentListService,
  getUserContentLikeListService,
};
