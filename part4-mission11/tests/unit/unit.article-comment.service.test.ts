import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

import AppError from '../../src/lib/appError.js';
import { articleRepository } from '../../src/repositories/article-repository.js';
import { articleCommentRepository } from '../../src/repositories/comments/article-comment-repository.js';
import { commentRepository } from '../../src/repositories/comments/comment-repository.js';
import { commentLikeRepository } from '../../src/repositories/like-repository.js';
import { notificationRepository } from '../../src/repositories/notification-repository.js';
import { userRepository } from '../../src/repositories/user-repository.js';
import { articleCommentService } from '../../src/services/comments/article-comment-service.js';
import { notificationService } from '../../src/services/notification-service.js';
import {
  makeArticleLite,
  makeComment,
  makeNotification,
  makeListedComment,
  makeCommentLike,
} from '../_helper/factories.js';
import prisma from '../_helper/prisma-mock.js';

describe('ArticleCommentService', () => {
  const ARTICLE_ID = 10;
  const AUTHOR_ID = 1;
  const OTHER_USER_ID = 2;

  beforeEach(async () => jest.restoreAllMocks());
  afterEach(async () => jest.clearAllMocks());

  test('getCommentsByArticleId: likeCount / isLiked 포함', async () => {
    jest
      .spyOn(articleCommentRepository, 'findByArticleId')
      .mockResolvedValue([
        makeListedComment({ id: 101, content: 'c1', user: { username: 'u1' } }),
        makeListedComment({ id: 102, content: 'c2', user: { username: 'u2' } }),
      ]);

    jest.spyOn(commentLikeRepository, 'countByTargetIds').mockResolvedValue([
      { commentId: 101, _count: { commentId: 3 } },
      { commentId: 102, _count: { commentId: 0 } },
    ]);
    jest
      .spyOn(commentLikeRepository, 'findByUserAndTargetIds')
      .mockImplementation(async (uid: number, _ids: number[]) =>
        uid === OTHER_USER_ID ? [{ commentId: 101 }] : []
      );

    const list = await articleCommentService.getCommentsByArticleId(
      ARTICLE_ID,
      OTHER_USER_ID
    );

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 101, likeCount: 3, isLiked: true }),
        expect.objectContaining({ id: 102, likeCount: 0, isLiked: false }),
      ])
    );
  });

  test('createArticleComment: 글 없음 → 404', async () => {
    jest.spyOn(articleRepository, 'findLiteById').mockResolvedValue(null);
    await expect(
      articleCommentService.createArticleComment(
        ARTICLE_ID,
        'hello',
        OTHER_USER_ID
      )
    ).rejects.toThrow(AppError);
  });

  test('createArticleComment: 자기 글이면 알림 스킵', async () => {
    jest
      .spyOn(articleRepository, 'findLiteById')
      .mockResolvedValue(
        makeArticleLite({ id: ARTICLE_ID, userId: AUTHOR_ID, title: 'T' })
      );
    jest
      .spyOn(articleCommentRepository, 'create')
      .mockResolvedValue(
        makeComment({ id: 201, articleId: ARTICLE_ID, userId: AUTHOR_ID })
      );

    const { notificationService } = await import(
      '../../src/services/notification-service.js'
    );
    const pushSpy = jest
      .spyOn(notificationService, 'pushArticleComment')
      .mockResolvedValue(
        makeNotification({
          userId: AUTHOR_ID,
          articleId: ARTICLE_ID,
          commentId: 201,
          type: 'NEW_COMMENT',
        })
      );

    await articleCommentService.createArticleComment(
      ARTICLE_ID,
      'c',
      AUTHOR_ID
    );

    expect(pushSpy).not.toHaveBeenCalled();
  });

  test('createArticleComment: 남의 글이면 알림 발송', async () => {
    jest
      .spyOn(articleRepository, 'findLiteById')
      .mockResolvedValue(
        makeArticleLite({ id: ARTICLE_ID, userId: AUTHOR_ID, title: 'T' })
      );
    jest
      .spyOn(articleCommentRepository, 'create')
      .mockResolvedValue(
        makeComment({ id: 202, articleId: ARTICLE_ID, userId: OTHER_USER_ID })
      );
    jest
      .spyOn(userRepository, 'findUsernameById')
      .mockResolvedValue({ username: '댓글쓴이' });

    const { notificationService } = await import(
      '../../src/services/notification-service.js'
    );
    const pushSpy = jest
      .spyOn(notificationService, 'pushArticleComment')
      .mockResolvedValue(
        makeNotification({
          id: 999,
          userId: AUTHOR_ID,
          articleId: ARTICLE_ID,
          commentId: 202,
          type: 'NEW_COMMENT',
          message: '새 댓글이 달렸습니다.',
        })
      );

    await articleCommentService.createArticleComment(
      ARTICLE_ID,
      'c',
      OTHER_USER_ID
    );

    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        receiverUserId: AUTHOR_ID,
        articleId: ARTICLE_ID,
        commentId: 202,
        articleTitle: 'T',
        commenterName: '댓글쓴이',
      })
    );
  });

  test('pushArticleComment: 정상', async () => {
    const repoSpy = jest
      .spyOn(notificationRepository, 'create')
      .mockResolvedValue(
        makeNotification({
          id: 1,
          userId: 42,
          articleId: 10,
          commentId: 777,
          message: '새 댓글',
        })
      );

    const res = await notificationService.pushArticleComment({
      receiverUserId: 42,
      articleId: 10,
      commentId: 777,
      articleTitle: 'T',
      commenterName: 'A',
    });

    expect(repoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 42,
        articleId: 10,
        commentId: 777,
        message: expect.any(String),
      })
    );
    expect(res.id).toBe(1);
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
      .mockResolvedValue(makeComment({ id: 301, userId: AUTHOR_ID }));
    await expect(
      articleCommentService.updateComment(301, OTHER_USER_ID, 'x')
    ).rejects.toThrow(AppError);
  });

  test('updateComment: 성공', async () => {
    jest
      .spyOn(commentRepository, 'findById')
      .mockResolvedValue(makeComment({ id: 301, userId: AUTHOR_ID }));
    const upd = jest
      .spyOn(commentRepository, 'update')
      .mockResolvedValue(
        makeComment({ id: 301, content: 'new', userId: AUTHOR_ID })
      );

    const r = await articleCommentService.updateComment(301, AUTHOR_ID, 'new');
    expect(upd).toHaveBeenCalledWith(301, 'new');
    expect(r.content).toBe('new');
  });

  test('pushNewComment: 정상', async () => {
    const repoSpy = jest
      .spyOn(notificationRepository, 'create')
      .mockResolvedValue(
        makeNotification({
          id: 1,
          userId: 42,
          articleId: 10,
          commentId: 777,
          message: '새 댓글',
        })
      );

    const res = await notificationService.pushArticleComment({
      receiverUserId: 42,
      articleId: 10,
      commentId: 777,
      articleTitle: 'T',
      commenterName: 'A',
    });

    expect(repoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 42,
        articleId: 10,
        commentId: 777,
        message: expect.any(String),
      })
    );
    expect(res.id).toBe(1);
  });

  test('deleteComment: 0건 삭제 → 403', async () => {
    jest.spyOn(commentRepository, 'delete').mockResolvedValue({ count: 0 });
    await expect(
      articleCommentService.deleteComment(301, OTHER_USER_ID)
    ).rejects.toThrow(AppError);
  });

  test('deleteComment: 성공', async () => {
    jest.spyOn(commentRepository, 'delete').mockResolvedValue({ count: 1 });
    await expect(
      articleCommentService.deleteComment(301, AUTHOR_ID)
    ).resolves.toEqual(
      expect.objectContaining({ message: '댓글이 삭제되었습니다.' })
    );
  });

  test('commentLike / commentUnlike 플로우', async () => {
    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(true);
    await expect(
      articleCommentService.commentLike(OTHER_USER_ID, 500)
    ).rejects.toThrow(AppError);

    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(false);
    const create = jest
      .spyOn(commentLikeRepository, 'create')
      .mockResolvedValue(
        makeCommentLike({ userId: OTHER_USER_ID, commentId: 500 })
      );
    jest.spyOn(commentLikeRepository, 'count').mockResolvedValue(7);
    const liked = await articleCommentService.commentLike(OTHER_USER_ID, 500);
    expect(create).toHaveBeenCalled();
    expect(liked.likeCount).toBe(7);

    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(false);
    await expect(
      articleCommentService.commentUnlike(OTHER_USER_ID, 500)
    ).rejects.toThrow(AppError);

    jest.spyOn(commentLikeRepository, 'exists').mockResolvedValueOnce(true);
    const del = jest
      .spyOn(commentLikeRepository, 'delete')
      .mockResolvedValue(
        makeCommentLike({ userId: OTHER_USER_ID, commentId: 500 })
      );
    jest.spyOn(commentLikeRepository, 'count').mockResolvedValue(6);
    const un = await articleCommentService.commentUnlike(OTHER_USER_ID, 500);
    expect(del).toHaveBeenCalled();
    expect(un.likeCount).toBe(6);
  });
});
