import { ForbiddenError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { CommentParams, PatchCommentDTO } from '@/dto/base-comments.dto.js';
import { ProductCommentRepository } from '@/repositories/product-comments.repository.js';
import {
  GetCommentListParams,
  PostCommentDTO,
} from '@/dto/product-comments.dto.js';

@injectable()
export class ProductCommentService {
  constructor(
    @inject(TYPES.ProductCommentRepository)
    private readonly productCommentRepository: ProductCommentRepository,
  ) {}

  async authorization({ userId, commentId }: CommentParams): Promise<boolean> {
    const comment = await this.productCommentRepository.findOwnerById({
      commentId,
    });
    return comment.userId === userId;
  }

  async getCommentList({
    cursorId,
    productId,
    pageSize,
  }: GetCommentListParams) {
    const comment = await this.productCommentRepository.findMany({
      cursorId,
      productId,
      pageSize,
    });
    return comment;
  }

  async postComment({ userId, productId, content }: PostCommentDTO) {
    const createData = {
      user: {
        connect: {
          id: userId,
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
      content,
    };
    const comment = await this.productCommentRepository.create(createData);
    return comment;
  }

  async patchComment({ commentId, userId, content }: PatchCommentDTO) {
    if (await this.authorization({ userId, commentId })) {
      const patchData = {
        content,
      };
      const comment = await this.productCommentRepository.update({
        commentId,
        patchData,
      });
      return comment;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    if (await this.authorization({ userId, commentId })) {
      const comment = await this.productCommentRepository.delete({ commentId });
      return comment;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
