import { Prisma } from '@prisma/client';
import { validatePassword, passwordHashing } from '@lib/bcrypt.js';
import { BadRequestError, UnauthorizedError } from '@lib/errors.js';
import type { PatchUserData, UserContentResponse, GetUserContent } from '@/types/user.types.js';
import type { Options, SingularContentType, UserId } from '@/types/shared.type.js';
import type { UserRepository } from '@/repositories/users.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserRepository) private readonly userRepository: UserRepository) {}

  async getUser({ userId }: UserId) {
    const result = await this.userRepository.findById({ userId });
    return result;
  }
  async patchUser({ userId, data }: PatchUserData) {
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
      const user = await this.userRepository.findPasswordById({ userId });
      if (await validatePassword(currentPassword, user.password)) {
        updateData['password'] = await passwordHashing(changePassword);
      } else {
        throw new UnauthorizedError('현재 비밀번호가 일치하지 않습니다.');
      }
    }
    const result = await this.userRepository.update({ userId, updateData });
    return result;
  }
  async deleteUser({ userId }: UserId) {
    const result = await this.userRepository.delete({ userId });
    return result;
  }
  async getUserContentList({ userId, content }: GetUserContent) {
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
    const userContent = await this.userRepository.findManyContent({
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
  async getUserContentLikeList({ userId, content }: GetUserContent) {
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
    const result = await this.userRepository.findManyLikeContent({ userId, singularContentType });
    return result;
  }
}
