import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

import AppError from '../../lib/appError.js';
import { commentRepository } from '../../repositories/comments/comment-repository.js';
import { productCommentRepository } from '../../repositories/comments/product-comment-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
import { notificationRepository } from '../../repositories/notification-repository.js';
import { productRepository } from '../../repositories/product-repository.js';
import { userRepository } from '../../repositories/user-repository.js';
import { productCommentService } from '../../services/comments/product-comment-service.js';
import { notificationService } from '../../services/notification-service.js';
import {
  makeProductLite,
  makeComment,
  makeListedComment,
  makeNotification,
  makeCommentLike,
} from '../_helper/factories.js';
import prisma from '../_helper/prisma-mock.js';

describe('ProductCommentService', () => {
  const PRODUCT_ID = 20;
  const OWNER_ID = 10;
  const OTHER_USER_ID = 11;

  beforeEach(async () => jest.restoreAllMocks());
  afterEach(async () => jest.clearAllMocks());

  test('getCommentsByProductId: likeCount / isLiked 포함', async () => {
    jest
      .spyOn(productCommentRepository, 'findByProductId')
      .mockResolvedValue([
        makeListedComment({ id: 901, content: 'p1', user: { username: 'u' } }),
      ]);
    jest
      .spyOn(commentLikeRepository, 'countByTargetIds')
      .mockResolvedValue([{ commentId: 901, _count: { commentId: 2 } }]);

    jest
      .spyOn(commentLikeRepository, 'findByUserAndTargetIds')
      .mockImplementation(async (uid: number, _ids: number[]) =>
        uid === OTHER_USER_ID ? [{ commentId: 901 }] : []
      );

    const list = await productCommentService.getCommentsByProductId(
      PRODUCT_ID,
      OTHER_USER_ID
    );
    expect(list[0]).toEqual(
      expect.objectContaining({ id: 901, likeCount: 2, isLiked: true })
    );
  });

  test('createProductComment: 상품 없음 → 404', async () => {
    jest.spyOn(productRepository, 'findLiteById').mockResolvedValue(null);
    await expect(
      productCommentService.createProductComment(PRODUCT_ID, 'c', OTHER_USER_ID)
    ).rejects.toThrow(AppError);
  });

  test('createProductComment: 내 상품이면 알림 스킵', async () => {
    jest
      .spyOn(productRepository, 'findLiteById')
      .mockResolvedValue(
        makeProductLite({ id: PRODUCT_ID, userId: OWNER_ID, name: 'N' })
      );
    jest
      .spyOn(productCommentRepository, 'create')
      .mockResolvedValue(
        makeComment({ id: 777, productId: PRODUCT_ID, userId: OWNER_ID })
      );

    const { notificationService } = await import(
      '../../services/notification-service.js'
    );
    const pushSpy = jest
      .spyOn(notificationService, 'pushProductComment')
      .mockResolvedValue(
        makeNotification({
          userId: OWNER_ID,
          productId: PRODUCT_ID,
          commentId: 777,
          type: 'NEW_COMMENT',
        })
      );

    await productCommentService.createProductComment(PRODUCT_ID, 'c', OWNER_ID);
    expect(pushSpy).not.toHaveBeenCalled();
  });

  test('createProductComment: 남의 상품이면 알림 발송', async () => {
    jest
      .spyOn(productRepository, 'findLiteById')
      .mockResolvedValue(
        makeProductLite({ id: PRODUCT_ID, userId: OWNER_ID, name: 'Mac' })
      );
    jest
      .spyOn(productCommentRepository, 'create')
      .mockResolvedValue(
        makeComment({ id: 778, productId: PRODUCT_ID, userId: OTHER_USER_ID })
      );
    jest
      .spyOn(userRepository, 'findUsernameById')
      .mockResolvedValue({ username: 'buyer' });

    const { notificationService } = await import(
      '../../services/notification-service.js'
    );
    const pushSpy = jest
      .spyOn(notificationService, 'pushProductComment')
      .mockResolvedValue(
        makeNotification({
          id: 1000,
          userId: OWNER_ID,
          productId: PRODUCT_ID,
          commentId: 778,
          type: 'NEW_COMMENT',
          message: '상품에 새 댓글이 달렸습니다.',
        })
      );

    await productCommentService.createProductComment(
      PRODUCT_ID,
      'c',
      OTHER_USER_ID
    );

    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        receiverUserId: OWNER_ID,
        productId: PRODUCT_ID,
        commentId: 778,
        productName: 'Mac',
        commenterName: 'buyer',
      })
    );
  });

  test('markAsRead: 정상', async () => {
    const upd = jest
      .spyOn(prisma.notification, 'updateMany')
      .mockResolvedValue({ count: 1 });

    await expect(
      notificationService.markAsRead(99, 7)
    ).resolves.toBeUndefined();

    expect(upd).toHaveBeenCalledWith({
      where: { id: 7, userId: 99 },
      data: { isRead: true },
    });
  });

  test('markAsRead: 알림이 없거나 내 것이 아니면 404', async () => {
    jest
      .spyOn(prisma.notification, 'updateMany')
      .mockResolvedValue({ count: 0 });

    await expect(notificationService.markAsRead(99, 7)).rejects.toThrow(
      '알림을 찾을 수 없습니다.'
    );
  });

  test('updateComment: 본인 아니면 403', async () => {
    jest
      .spyOn(commentRepository, 'findById')
      .mockResolvedValue(
        makeComment({ id: 1, userId: OWNER_ID, productId: PRODUCT_ID })
      );
    await expect(
      productCommentService.updateComment(1, OTHER_USER_ID, 'x')
    ).rejects.toThrow(AppError);
  });

  test('updateComment: 성공', async () => {
    jest
      .spyOn(commentRepository, 'findById')
      .mockResolvedValue(
        makeComment({ id: 1, userId: OTHER_USER_ID, productId: PRODUCT_ID })
      );
    const upd = jest.spyOn(commentRepository, 'update').mockResolvedValue(
      makeComment({
        id: 1,
        content: 'x',
        userId: OTHER_USER_ID,
        productId: PRODUCT_ID,
      })
    );

    const r = await productCommentService.updateComment(1, OTHER_USER_ID, 'x');
    expect(upd).toHaveBeenCalledWith(1, 'x');
    expect(r.content).toBe('x');
  });

  test('pushNewComment: 정상', async () => {
    const repoSpy = jest
      .spyOn(notificationRepository, 'create')
      .mockResolvedValue(
        makeNotification({
          id: 1,
          userId: 42,
          productId: 10,
          commentId: 777,
          message: '새 댓글' /* type 생략 가능 */,
        })
      );

    const res = await notificationService.pushProductComment({
      receiverUserId: 42,
      productId: 10,
      commentId: 777,
      productName: 'N',
      commenterName: 'P',
    });

    expect(repoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 42,
        productId: 10,
        commentId: 777,
        message: expect.any(String),
      })
    );
    expect(res.id).toBe(1);
  });

  test('deleteComment: 0건 삭제 → 403', async () => {
    jest.spyOn(commentRepository, 'delete').mockResolvedValue({ count: 0 });
    await expect(
      productCommentService.deleteComment(1, OTHER_USER_ID)
    ).rejects.toThrow(AppError);
  });

  test('deleteComment: 성공', async () => {
    jest.spyOn(commentRepository, 'delete').mockResolvedValue({ count: 1 });
    await expect(
      productCommentService.deleteComment(1, OTHER_USER_ID)
    ).resolves.toEqual(
      expect.objectContaining({ message: '댓글이 삭제되었습니다.' })
    );
  });

  test('commentLike / commentUnlike 플로우', async () => {
    // like: 중복 → 에러
    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(true);
    await expect(
      productCommentService.commentLike(OTHER_USER_ID, 500)
    ).rejects.toThrow(AppError);

    // like: 정상 (create → Like 객체 반환)
    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(false);
    const create = jest
      .spyOn(commentLikeRepository, 'create')
      .mockResolvedValue(
        makeCommentLike({ userId: OTHER_USER_ID, commentId: 500 })
      );
    jest.spyOn(commentLikeRepository, 'count').mockResolvedValue(8);
    const liked = await productCommentService.commentLike(OTHER_USER_ID, 500);
    expect(create).toHaveBeenCalled();
    expect(liked.likeCount).toBe(8);

    // unlike: 기록 없음 → 에러
    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(false);
    await expect(
      productCommentService.commentUnlike(OTHER_USER_ID, 500)
    ).rejects.toThrow(AppError);

    // unlike: 정상 (delete → Like 객체 반환)
    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(true);
    const del = jest
      .spyOn(commentLikeRepository, 'delete')
      .mockResolvedValue(
        makeCommentLike({ userId: OTHER_USER_ID, commentId: 500 })
      );
    jest.spyOn(commentLikeRepository, 'count').mockResolvedValue(7);
    const un = await productCommentService.commentUnlike(OTHER_USER_ID, 500);
    expect(del).toHaveBeenCalled();
    expect(un.likeCount).toBe(7);
  });
});
