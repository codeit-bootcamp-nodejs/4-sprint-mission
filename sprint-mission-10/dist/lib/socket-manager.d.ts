import { Server } from "socket.io";
import type { NOTIFTICATION_TYPE } from "@prisma/client";
export declare function initialize(_io: Server): void;
export declare function sendNotificationToUser(userId: string, text: string, type: NOTIFTICATION_TYPE): Promise<boolean>;
export declare function sendAdHocGroupNotification(userIds: Number[], text: string): Promise<number | undefined>;
//# sourceMappingURL=socket-manager.d.ts.map