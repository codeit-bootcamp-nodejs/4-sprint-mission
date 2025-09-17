import type {
  CreateDTO,
  DeleteDTO,
  FindByIdDTO,
  FindManyDTO,
  LikeDTO,
  UnlikeDTO,
  UpdateDTO,
} from '@/dto/articles.dto.js';
import prisma from '@/lib/prisma.js';
import type { ArticleId } from '@/types/article.types.js';

class ArticleRepository {
  async findOwnerById({ articleId }: ArticleId) {
    return await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { userId: true },
    });
  }
  async create({ title, userId, content }: CreateDTO) {
    console.log('Repository: DB에 새 게시글 저장');
    return await prisma.article.create({
      data: {
        title,
        userId,
        content,
      },
    });
  }
  async findById({ articleId, userId }: FindByIdDTO) {
    console.log(`Repository: id ${articleId} 게시글 조회`);
    return await prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likes: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  }
  async findMany({ keyword, page, pageSize, userId }: FindManyDTO) {
    console.log(`Repository: 게시글 목록 조회`);
    return await prisma.article.findMany({
      where: {
        OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likes: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
  async update({ articleId, data }: UpdateDTO) {
    console.log(`Repository: id ${articleId} 게시글 업데이트`);
    return await prisma.article.update({
      where: { id: articleId },
      data,
    });
  }
  async delete({ articleId }: DeleteDTO) {
    console.log(`Repository: id ${articleId} 게시글 삭제`);
    return await await prisma.article.delete({
      where: { id: articleId },
    });
  }
  async like({ userId, articleId }: LikeDTO) {
    console.log(`Repository: id ${articleId} 게시글 좋아요`);
    return await prisma.articleLike.create({
      data: {
        userId,
        articleId,
      },
      select: {
        article: true,
      },
    });
  }
  async unlike({ userId, articleId }: UnlikeDTO) {
    console.log(`Repository: id ${articleId} 게시글 좋아요 취소`);
    return await prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
      select: {
        article: true,
      },
    });
  }
}

export default new ArticleRepository();
