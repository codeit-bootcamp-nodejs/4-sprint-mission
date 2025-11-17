import { describe, expect, beforeEach, it, jest } from "@jest/globals";
import { CommentService } from "../src/service/user.service.ts/comment.service.js";
// Notification 타입을 사용하기 위해 명시적으로 가져옵니다.
import { PrismaClient, type Notification } from "@prisma/client";
import {
  WebsocketService,
  type NotificationPayload,
} from "../src/socket/socket.js";
import mockMethod from "./__mock__/prisma.js";
import type { CommentCreateDTO } from "../src/dto/comment.dto.js";
import { NotificationService } from "../src/service/user.service.ts/notification.service.js";

jest.mock("../src/lib/prisma", () => {
  const mockMethod = require("./__mock__/prisma.js").default;
  return {
    __esModule: true,
    default: mockMethod,
  };
});

// ✅ createAndGenerate가 반환할 객체의 타입을 정의합니다.
type NotificationResult = {
  notification: Notification;
  payload: NotificationPayload;
};

// 변수 선언만 외부에 유지합니다.
let notificationService: NotificationService;
let commentService: CommentService;
let wssMock: Partial<WebsocketService>;

type CreateAndGenerateSignature = (
  ...args: any[]
) => Promise<NotificationResult>;

// Mock 함수 변수를 선언합니다.
let mockCreateAndGenerate: jest.Mock<CreateAndGenerateSignature>;

describe("notification service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 1. WebSocket Mock 초기화
    wssMock = {
      emitToUser: jest.fn(),
      broadcast: jest.fn(),
    };

    // 2. Mock 함수를 초기화합니다.
    // Mock 함수가 Promise를 반환하는 시그니처를 따르도록 any를 사용하여 할당합니다.
    mockCreateAndGenerate = jest.fn() as any;

    // 3. NotificationService Mock 초기화: 분리된 Mock 함수를 주입합니다.
    notificationService = {
      createAndGenerate: mockCreateAndGenerate,
      // 다른 메서드도 필요하면 여기에 Mock 추가
    } as unknown as NotificationService;

    // 4. Service 인스턴스 재생성 및 Mock 주입
    commentService = new CommentService(
      mockMethod as unknown as PrismaClient,
      notificationService,
      wssMock as unknown as WebsocketService
    );
  });

  it("댓글 생성 알림 성공", async () => {
    const senderId = 2; // 댓글 작성자
    const receiverId = 1; // 게시글 소유자
    const nickname = "juno";

    const newComment: CommentCreateDTO = {
      id: 3,
      content: "test",
      type: "ARTICLE",
      title: "testTitle",
      createdAt: new Date("2025-01-26"),
      updatedAt: new Date("2025-01-27"),
      productId: 0,
      articleId: 1,
      ownerId: senderId,
    };

    // 알림 페이로드 정의
    const payload: NotificationPayload = {
      type: "NEW_COMMENT",
      nickname: nickname,
      userId: senderId,
      message: "새 댓글이 달렸습니다.",
      productId: 0,
      articleId: 1,
    };

    // Prisma Mock 설정
    // 게시글 소유자 ID(1) 반환 -> 댓글 작성자(2)와 다르므로 알림 발생
    mockMethod.article.findUnique.mockResolvedValueOnce({
      ownerId: receiverId,
    });
    mockMethod.comment.create.mockResolvedValueOnce(newComment);

    // ✅ FIX: 객체를 NotificationResult 타입으로 강제 변환(Type Assertion)합니다.
    mockCreateAndGenerate.mockResolvedValueOnce({
      notification: {
        id: 1,
        category: "NEW_COMMENT",
        type: "UNREAD",
        content: "juno님이 게시글에 댓글을 남겼습니다",
        createdAt: new Date(),
        receiverId: receiverId,
        senderId: senderId,
      },
      payload: payload,
    } as NotificationResult);

    const emitToUserMock = wssMock.emitToUser as jest.Mock;

    // 서비스 메서드 호출
    await commentService.createComment(senderId, nickname, {
      ...newComment,
      productId: 0, // undefined로 명시하여 MARKET/ARTICLE 로직이 정확히 분기되도록 합니다.
      articleId: 1,
    });

    // 유효성 검사

    expect(mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
    expect(mockMethod.comment.create).toHaveBeenCalledTimes(1);

    // notificationService 호출 확인
    expect(mockCreateAndGenerate).toHaveBeenCalledTimes(1);
    expect(mockCreateAndGenerate).toHaveBeenCalledWith(
      senderId, // userId (sender)
      receiverId, // targetId (receiver)
      expect.any(String), // message
      "UNREAD", // type
      "NEW_COMMENT", // category
      1, // articleId
      undefined, // productId
      nickname // nickname
    );

    // WebSocket 호출 확인
    expect(emitToUserMock).toHaveBeenCalledTimes(1);
    expect(emitToUserMock).toHaveBeenCalledWith(receiverId, "NEW_COMMENT", {
      type: "NEW_COMMENT",
      payload,
    });
  });

  
  it("댓글 생성 알림 실패", async() => {
    const userId = 2; // 댓글 작성자
    const receiverId = 1; // 게시글 소유자 (댓글 작성자와 다르게 설정하여 알림 로직 실행 유도)
    const nickname = "Nickname"
    
    
  mockMethod.article.findUnique.mockResolvedValue({
  id: 1,
  ownerId: receiverId, // <- 반드시 있어야 함
  title: "Test Article",
});

    const newComment: CommentCreateDTO = {
            id: 3,
            content: "Notification Fail Test",
            type: "ARTICLE",
            title: "Notif Fail Title",
            ownerId:userId,
            updatedAt:new Date(),
            createdAt:new Date(),
            productId: 0,
            articleId: 1,
        };

      mockMethod.comment.create.mockResolvedValue(newComment)


mockCreateAndGenerate.mockRejectedValue(new Error("해당 게시글이 존재 하지 않습니다"))        
await expect(
    commentService.createComment(userId, nickname, newComment)
  ).rejects.toThrow("해당 게시글이 존재 하지 않습니다");

  expect(mockMethod.comment.create).toHaveBeenCalledTimes(1);
  expect(wssMock.emitToUser).toHaveBeenCalledTimes(0);
  expect(mockCreateAndGenerate).toHaveBeenCalledTimes(1);
  
  })
})