import prisma from "../lib/prismaClient";

//알림 목록 조회 GET - 사용자는 자신의 알림 목록을 조회할 수 있습니다.

export const notificationRepository = {

    async findAllByUserId(userId: number) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },

    //안앍은 알림개수 조회 GET(- 사용자는 자신의 안 읽은 알림의 개수를 조회할 수 있습니다.)

    async countUnread(userId: number) {
        return prisma.notification.count({
            where: { userId, isRead: false },
        });
    },

    //알림 읽음 처리(patch) (사용자는 자신의 알림을 읽음 처리 할 수 있습니다.)

    async markAsRead(notificationId: number, userId: number) {
        return prisma.notification.update({
            where: { id: notificationId, userId },
            data: { isRead: true },
        });
    },



    //실시간 알림 받기
    async createNotification(userId: number, message: string) {
        return prisma.notification.create({
            data: {
                userId,
                message,
                isRead: false,
            },
        });
    },
};


