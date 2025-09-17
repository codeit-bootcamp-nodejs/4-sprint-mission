import { Prisma } from '@prisma/client';
import { validatePassword, passwordHashing } from '@lib/bcrypt.js';
import { BadRequestError, UnauthorizedError } from '@lib/errors.js';
import type { PatchUserData, UserContentResponse, GetUserContent } from '@/types/user.types.js';
import type { Options, SingularContentType, UserId } from '@/types/shared.type.js';
import UserRepository from '@/repositories/users.repository.js';

async function getUserService({ userId }: UserId) {
  const result = await UserRepository.findById({ userId });
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
    const user = await UserRepository.findPasswordById({ userId });
    if (await validatePassword(currentPassword, user.password)) {
      updateData['password'] = await passwordHashing(changePassword);
    } else {
      throw new UnauthorizedError('현재 비밀번호가 일치하지 않습니다.');
    }
  }
  const result = await UserRepository.update({ userId, updateData });
  return result;
}
async function deleteUserService({ userId }: UserId) {
  const result = await UserRepository.delete({ userId });
  return result;
}
async function getUserContentListService({ userId, content }: GetUserContent) {
  let options: Options = {};
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
  const userContent = await UserRepository.findManyContent({
    userId,
    options,
  });
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
  let singularContentType: SingularContentType;
  switch (content) {
    case 'products':
      singularContentType = 'product';
      break;
    case 'articles':
      singularContentType = 'article';
      break;
    default:
      throw new BadRequestError(`'${content}' 타입의 좋아요 목록은 조회할 수 없습니다.`);
  }
  const result = await UserRepository.findManyLikeContent({ userId, singularContentType });
  return result;
}

export {
  getUserService,
  patchUserService,
  deleteUserService,
  getUserContentListService,
  getUserContentLikeListService,
};
