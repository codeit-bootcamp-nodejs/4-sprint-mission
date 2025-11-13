import { notificationRepository } from '../repositories/notification-repository.js';
import { wsGateway } from '../lib/ws.js';

export const notificationService = {
  async pushPriceChange(args: {
    receiverUserId: number;
    productId: number;
    productName: string;
    oldPrice: number;
    newPrice: number;
  }) {
    const { receiverUserId, productId, productName, oldPrice, newPrice } = args;

    const message = `${productName} 가격이 ${oldPrice}원 → ${newPrice}원 으로 변경되었습니다.`;

    const notif = await notificationRepository.create({
      userId: receiverUserId,
      type: 'PRICE_CHANGE',
      message,
      productId,
    });

    // 객체 1개로 전달 + data는 있을 때만 포함
    wsGateway.notifyUser({
      userId: receiverUserId,
      type: notif.type,
      message: notif.message,
      createdAt: notif.createdAt,
      ...(notif.productId !== null
        ? { data: { productId: notif.productId } }
        : {}),
    });

    return notif;
  },

  async pushNewComment(args: {
    receiverUserId: number;
    articleId: number;
    commentId: number;
    articleTitle: string;
    commenterName: string;
  }) {
    const {
      receiverUserId,
      articleId,
      commentId,
      articleTitle,
      commenterName,
    } = args;

    const message = `${commenterName} 님이 '${articleTitle}' 글에 댓글을 남겼습니다.`;

    const notif = await notificationRepository.create({
      userId: receiverUserId,
      type: 'NEW_COMMENT',
      message,
      articleId,
      commentId,
    });

    // 객체 1개로 전달 + data는 있을 때만 포함
    wsGateway.notifyUser({
      userId: receiverUserId,
      type: notif.type,
      message: notif.message,
      createdAt: notif.createdAt,
      ...(notif.articleId !== null && notif.commentId !== null
        ? { data: { articleId: notif.articleId, commentId: notif.commentId } }
        : {}),
    });

    return notif;
  },

  async pushProductComment(args: {
    receiverUserId: number;
    productId: number;
    commentId: number;
    productName: string;
    commenterName: string;
  }) {
    const { receiverUserId, productId, commentId, productName, commenterName } =
      args;
    const message = `${commenterName} 님이 상품 '${productName}'에 댓글을 남겼습니다.`;

    const notif = await notificationRepository.create({
      userId: receiverUserId,
      type: 'NEW_COMMENT',
      message,
      productId,
      commentId,
    });

    wsGateway.notifyUser({
      userId: receiverUserId,
      type: notif.type,
      message: notif.message,
      createdAt: notif.createdAt,
      ...(notif.productId !== null && notif.commentId !== null
        ? { data: { productId: notif.productId, commentId: notif.commentId } }
        : {}),
    });

    return notif;
  },

  async getMyNotifications(userId: number) {
    return notificationRepository.findByUserId(userId);
  },

  async getMyUnreadCount(userId: number) {
    return notificationRepository.countUnread(userId);
  },

  async markAsRead(userId: number, notificationId: number) {
    return notificationRepository.markAsRead(userId, notificationId);
  },

  async markAllAsRead(userId: number) {
    return notificationRepository.markAllAsRead(userId);
  },
};
