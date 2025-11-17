import { describe, expect, beforeAll, beforeEach, it } from "@jest/globals";
import { CommentService } from "../src/service/user.service.ts/comment.service.js";
import { PrismaClient, type Notification } from "@prisma/client";
import mockMethod from "./__mock__/prisma.js";
import { WebsocketService } from "../src/socket/socket.js";
import type { CommentCreateDTO, CommentDTO, CommentPatchDTO, CommentQueryDTO } from "../src/dto/comment.dto.js";
import mockData from "./comment.json" with { type: "json" };
import prisma from "../src/lib/prisma.js";
import type { NotificationService } from "service/notification.service.js";
import { notEqual } from "assert";


const mockNotificationService: Partial<NotificationService> = {
    createAndGenerate: jest.fn(), // ✅ jest.fn()으로 만들어야 mockRejectedValue 사용 가능
};



jest.mock("../src/lib/prisma", () => {
  const mockMethod = require("./__mock__/prisma.js").default;
  return {
    __esModule: true,
    default: mockMethod,
  };
});
describe("CommentService", () => {

    let commentService: CommentService;
    let wssMock: Partial<WebsocketService>;
    beforeEach(() => {
        jest.clearAllMocks()
        wssMock = {
          broadcast: jest.fn(),
          emitToUser: jest.fn(),
        };
        mockNotificationService.createAndGenerate = jest.fn().mockResolvedValue({
  notification: {} as Notification,
  payload: { type: "NEW_COMMENT", message: "Mock Notification" }
});
        commentService = new CommentService(prisma as unknown as PrismaClient,mockNotificationService as unknown as NotificationService, wssMock as unknown as WebsocketService,);
        //mockNotificationService.createAndGenerate.mockClear(); 
    })//-> 초기화
    it("accesses a comment successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const{comment1} = mockData;
        // 예상 리턴값 작성
        mockMethod.comment.findUnique.mockResolvedValue(comment1);
        // 서비스 메서드 호출
        const result = await commentService.accessComment(1)
        // 모의 함수 호출 여부 및 인자 검증
        expect( mockMethod.comment.findUnique).toHaveBeenCalledTimes(1)
        expect(mockMethod.comment.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 1 }
            })
        )
        // 결과 검증
        expect(result).toEqual(comment1)
    })


    it("fail to access comment ", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const wrongId = 999
        // 예상 리턴값 작성
        mockMethod.comment.findUnique.mockResolvedValue(null);
        // 서비스 메서드 호출
        const resultProsmise = commentService.accessComment(wrongId);
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.comment.findUnique).toHaveBeenCalledTimes(1)
        expect(mockMethod.comment.findUnique).toHaveBeenCalledWith({
            where: { id: wrongId },
        })
        // 결과 검증
        await expect(resultProsmise).rejects.toThrow("해당 댓글이 존재 하지 않습니다");
    })




    it("access comments with type MARKET successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const { comment1, comment2 } = mockData;
        const commentsArray = [comment1, comment2];
        const query  : CommentQueryDTO = {
            take:10,
            page:1,
            type: "MARKET",
            id : 1,
        }
        // 예상 리턴값 작성
        mockMethod.comment.findMany.mockResolvedValue(commentsArray);
        // 서비스 메서드 호출
        const result = await commentService.accessCommentList(query)
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.comment.findMany).toHaveBeenCalledTimes(1)
        expect(mockMethod.comment.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { productId: 1 },
                skip: 0,
                take: 10,
            })
        )
        // 결과 검증
        expect(result).toEqual(commentsArray);
    })

    it("fail to a access comment  with type MARKET", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const wrongId = 99
        const query  : CommentQueryDTO = {
            take:10,
            page:1,
            type: "MARKET",
            id : wrongId,
        }
        // 예상 리턴값 작성
        mockMethod.comment.findMany.mockResolvedValue([]);
        // 서비스 메서드 호출
        const result = await commentService.accessCommentList(query)
        // 모의 함수 호출 여부 및 인자 검증
        expect( mockMethod.comment.findMany).toHaveBeenCalledTimes(1)
        expect(mockMethod.comment.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { productId: wrongId },
                skip: 0,
                take: 10,
            })
        )
        // 결과 검증
        await expect(result).toEqual([]);
    })


    it("access comments with type Article successfully", async () => {
         // 테스트 로직 작성
        // 모의 데이터 설정
        const {comment1, comment2}  = mockData;
        const commentsArray = [comment1, comment2];
        const query  : CommentQueryDTO = {
            take:10,
            page:1,
            type: "ARTICLE",
            id : 1,
        }
        // 예상 리턴값 작성
        mockMethod.comment.findMany.mockResolvedValue(commentsArray);
        // 서비스 메서드 호출
        const result = await commentService.accessCommentList(query)
        // 모의 함수 호출 여부 및 인자 검증
        expect( mockMethod.comment.findMany).toHaveBeenCalledTimes(1)
        expect( mockMethod.comment.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { articleId : 1},
                skip: 0,
                take:10
            })
        )
        // 결과 검증
        expect(result).toBe(commentsArray);
    })


    it("fail to a access comment  with type article", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const wrongId = 99
        const query  : CommentQueryDTO = {
            take:10,
            page:1,
            type: "ARTICLE",
            id : wrongId,
        }
        // 예상 리턴값 작성
        mockMethod.comment.findMany.mockResolvedValue([]);
        // 서비스 메서드 호출
        const resultPromise = await commentService.accessCommentList(query)
        // 모의 함수 호출 여부 및 인자 검증
        expect( mockMethod.comment.findMany ).toHaveBeenCalledTimes(1)
        expect( mockMethod.comment.findMany ).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { articleId : wrongId},
                skip: 0,
                take:10
            })
        )
        // 결과 검증
        await expect(resultPromise).toEqual([]);
    })


    it("patches a comment successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const { comment2 } = mockData;
        // 예상 리턴값 작성
        mockMethod.comment.findUnique.mockResolvedValue(comment2);
        mockMethod.comment.update.mockResolvedValue(comment2);
        const data : CommentPatchDTO = {
            id: 2,
            content: "수정된 댓글 내용",
            title: "수정된 댓글 제목",
            ownerId: 2,
        }
        mockMethod.comment.update.mockResolvedValue({
            ...comment2,
            ...data,
        });
        // 서비스 메서드 호출
        const result = await commentService.modifyComment(2, data)

        // 모의 함수 호출 여부 및 인자 검증
        
        expect( mockMethod.comment.findUnique).toHaveBeenCalledTimes(1)
        expect( mockMethod.comment.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 2 }
            })
        )
        expect( mockMethod.comment.update).toHaveBeenCalledTimes(1)
        expect( mockMethod.comment.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 2 },
                data: {
                    content: "수정된 댓글 내용",
                    title: "수정된 댓글 제목",
                }
            })
        )
        // 결과 검증    
        expect(result).toEqual({
            ...comment2,
            ...data,
        });
            })



    it("fail to patch a comment ", async () => {
     // 테스트 로직 작성
        // 모의 데이터 설정
        const wrongId = 999
        const data : CommentPatchDTO = {
            id: wrongId,
            content: "수정된 댓글 내용",
            title: "수정된 댓글 제목",
            ownerId: 2,
        }
        // 예상 리턴값 작성
        mockMethod.comment.findUnique.mockResolvedValue(null);
        // 서비스 메서드 호출
        const resultPromise = commentService.modifyComment(2, data)
        // 모의 함수 호출 여부 및 인자 검증
        expect( mockMethod.comment.findUnique).toHaveBeenCalledTimes(1)
        expect(mockMethod.comment.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: wrongId }
            })
        )// 업데이트 값 호출 x
         expect(mockMethod.comment.update).toHaveBeenCalledTimes(0);
        // 결과 검증
        await expect(resultPromise).rejects.toThrow("해당 댓글이 없습니다");
    })


    it("deletes a comment successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const { comment1 } = mockData;
        // 예상 리턴값 작성
         const uniqueComment =  mockMethod.comment.findUnique
        const deleteComment =  mockMethod.comment.delete
        uniqueComment.mockResolvedValue(comment1);
        deleteComment.mockResolvedValue(comment1);
        // 서비스 메서드 호출
        const result = await commentService.deleteComment(1)
    
        // 모의 함수 호출 여부 및 인자 검증
       
        expect(uniqueComment ).toHaveBeenCalledTimes(1)
        expect( uniqueComment ).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 1 }
            })
        )
      
        expect( deleteComment).toHaveBeenCalledTimes(1)
        expect( deleteComment ).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 1 }
            })
        )
        // 결과 검증  
        expect(result).toEqual(comment1);  
    })


    it("fail to a delete comment ", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const wrongId = 999
        const uniqueComment =  mockMethod.comment.findUnique
        const deleteComment =  mockMethod.comment.delete
        // 예상 리턴값 작성
        uniqueComment.mockResolvedValue(null);
        // 서비스 메서드 호출
        const resultPromise = commentService.deleteComment(wrongId)

        // 모의 함수 호출 여부 및 인자 검증
        expect( uniqueComment).toHaveBeenCalledTimes(1)
        expect(uniqueComment).toHaveBeenCalledWith({
            where: { id: wrongId },
        })
        expect(deleteComment).toHaveBeenCalledTimes(0);
        // 결과 검증
        await expect(resultPromise).rejects.toThrow("해당 댓글이 없습니다");
        })



    it("creates a comment successfully at article", async () => {
        // 테스트 로직 작성
        const userId = 1
        // 모의 데이터 설정
        const nickname = "UserNickname";   // 유저 닉네임
        const newComment: CommentCreateDTO = {
            id: 3,
            content: "This is a new comment",
            createdAt:new Date(),
            updatedAt:new Date,
            type: "ARTICLE",
            title: "New Comment Title",
            ownerId: 2,
            productId: 0,
            articleId: 1,
        };
        
        // 예상 리턴값 작성
        mockMethod.comment.create.mockResolvedValue(newComment);
        mockMethod.article.findUnique.mockResolvedValue({
            id: 1,
            ownerId: 2,
            title: "Test Article",
        });
        // 서비스 메서드 호출
        const result = await commentService.createComment(userId,nickname,newComment)
        // 모의 함수 호출 여부 및 인자 검증
        expect( mockMethod.comment.create).toHaveBeenCalledTimes(1)
        expect(mockMethod.comment.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    content: "This is a new comment",
                    title: "New Comment Title",
                    type: "ARTICLE",
                    article: { connect: { id: 1 } },
                    
                })
            })
        )
        // 결과 검증
        expect(result).toEqual(newComment);
    })


    it("fail to create a comment", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const userId = 2
        const nickname= "jin"
        const receiverId = 1
       
         const newComment: CommentCreateDTO = {
            id: 3,
            content: "This is a new comment",
            type: "ARTICLE",
            title: "New Comment Title",
            ownerId: userId,
            createdAt:new Date(),
            updatedAt:new Date(),
            productId: 0,
            articleId: 1,
        };

         

        const notificationError = new Error("Notification Service Failed");
        // 예상 리턴값 작성

        mockMethod.article.findUnique.mockResolvedValue({
            id: 1,
            ownerId: receiverId,
            title: "Test Article",
        });
         mockMethod.comment.create.mockResolvedValue(newComment);
(mockNotificationService.createAndGenerate as jest.Mock).mockRejectedValue(
    new Error("Notification Service Failed")
);
  // 서비스 메서드 호출 시 Promise 그대로 전달
  await expect(
    commentService.createComment(userId, nickname, newComment)
  ).rejects.toThrow("Notification Service Failed");

       expect( mockMethod.comment.create).toHaveBeenCalledTimes(1);
       expect(mockMethod.comment.create).toHaveBeenCalledWith(
  expect.objectContaining({
    data: expect.objectContaining({
      content: newComment.content,
      title: newComment.title,
      type: newComment.type,
      article: { connect: { id: newComment.articleId } }
    })
  })
);
        // 2. NotificationService 호출은 시도되었어야 합니다 (오류 발생 지점)
        expect(mockNotificationService.createAndGenerate).toHaveBeenCalledTimes(1);
        
        // 3. WebSocket Emit은 호출되지 않아야 합니다 (NotificationService 실패로 도달하지 못함)
        expect(wssMock.emitToUser).toHaveBeenCalledTimes(0); 
  })
})
