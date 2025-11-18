import { Server } from 'socket.io';

import { NotificationTargetType, NotificationTypeEnum } from '../../../generated/prisma/client.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import type { EventHandler } from '../../utils/event-bus.js';
import { HttpException } from '../../utils/http-exception.js';
import type { CommentCreatedEvent } from '../comment/comment.js';
import { notificationRepository } from '../notification/notification.repository.js';
import { postRepository } from '../post/post.repository.js';

export class CommentNotificationHandler implements EventHandler<CommentCreatedEvent> {
  constructor(private io: Server) {}

  async handle(event: CommentCreatedEvent): Promise<void> {
    const { id, postId, userId, content, createdAt } = event.eventData;

    const post = await postRepository.findById(postId);
    if (!post) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.postNotFound);
    }

    // 본인 게시글에 작성한 댓글 알림 제외
    if (post.userId === userId) {
      return;
    }
    await postRepository.incrementCommentCount(postId);

    const message = `회원님의 게시글에 새 댓글이 달렸습니다: "${content.substring(0, 20)}${content.length > 20 ? '...' : ''}"`;

    this.io.to(`user:${post.userId}`).emit('notification', {
      type: 'COMMENT_CREATED',
      postId: postId,
      commentId: id,
      message,
      timestamp: createdAt,
    });

    const createNotificationData = {
      userId: post.userId,
      type: NotificationTypeEnum.NEW_COMMENT,
      targetType: NotificationTargetType.POST,
      targetId: postId,
      message,
    };

    await notificationRepository.create(createNotificationData);
  }
}
