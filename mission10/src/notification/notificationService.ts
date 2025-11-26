import { notificationRepository } from "./notificationRepository"; 
import { io } from "../socket/socket";


export const notificationService = {

  //알림 목록 조회 GET - 사용자는 자신의 알림 목록을 조회할 수 있습니다.
  async getNotifications(userId: number) {
    return notificationRepository.findAllByUserId(userId);
  },


//안앍은 알림개수 조회 GET(- 사용자는 자신의 안 읽은 알림의 개수를 조회할 수 있습니다.)
async getUnreadCount(userId: number) {
  return notificationRepository.countUnread(userId);
},

//알림 읽음 처리(patch) (사용자는 자신의 알림을 읽음 처리 할 수 있습니다.)
async markAsRead (notificationId: number, userId: number) {
  return notificationRepository.markAsRead(notificationId, userId);
},


//실시간 알림 전송
async createNotification(userId: number, message: string) {
    // Repository를 통해 DB에 새 알림 생성
    const notification = await notificationRepository.createNotification(userId, message);
    // 2️⃣ Socket.IO를 이용해 실시간으로 전송
    io.to(`user-${userId}`).emit("new-notification", notification);

    return notification;
  },

};

