import { Prisma } from '@prisma/client';
import { validatePassword, passwordHashing } from '@lib/bcrypt.js';
import { UnauthorizedError } from '@lib/errors.js';
import prisma from '@lib/prisma.js';
import type {
  PatchUserData,
  UserContentResponse,
  UserWithContent,
  GetUserContent,
} from '@/types/user.types.js';
import type { UserId } from '@/types/shared.type.js';

async function getUserService({ userId }: UserId) {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
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
async function patchUserService({ userId, data }: PatchUserData) {
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
        id: userId,
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
      id: userId,
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
async function deleteUserService({ userId }: UserId) {
  const result = await prisma.user.delete({
    where: {
      id: userId,
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
async function getUserContentListService({ userId, content }: GetUserContent) {
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
            likes: { where: { userId } },
          },
        },
      },
    };
  }
  const userContent = (await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    ...options,
  })) as UserWithContent;
  let result: UserContentResponse;
  if (content === 'products' || content === 'articles') {
    const contentList = userContent[content] ?? [];
    const filteredContentList = contentList.map((content) => {
      const { likes: _likesNouse, _count: _countNoUse, ...filteredContent } = content;
      return {
        likeCount: content._count.likes,
        isLike: userId ? content.likes.length === 1 : false,
        ...filteredContent,
      };
    });
    result = { data: filteredContentList };
  } else {
    result = { data: userContent.comments ?? [] };
  }
  return result;
}
async function getUserContentLikeListService({ userId, content }: GetUserContent) {
  const singularContentType = content.endsWith('s') ? content.slice(0, -1) : content;
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      [`${singularContentType}Likes`]: {
        include: {
          [singularContentType]: true,
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
