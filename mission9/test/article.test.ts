import { describe, expect, beforeAll, beforeEach, it } from "@jest/globals";
//import { CommentService } from '../src/service/comment.service.js';
import { ArticleService } from "../src/service/user.service.ts/article.service.js";
import mockData from "./article.json" with { type: "json" };
import { PrismaClient } from "@prisma/client";
import mockMethod from "./__mock__/prisma.js";

jest.mock("../src/lib/prisma", () => {
  const mockMethod = require("./__mock__/prisma.js").default; // 동적으로 require
  return {
    __esModule: true,
    default: mockMethod,
  };
});

describe("ArticleService Integration", () => {
  let articleService: ArticleService;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    articleService = new ArticleService(
        mockMethod as unknown as PrismaClient
        );
  });
    // 초기화 작업
    it("access article successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const {article1} = mockData;
        // 예상 리턴값 작성
        mockMethod.article.findUnique.mockResolvedValue(article1);
     
        // 서비스 메서드 호출
        const result = await articleService.accessArticle(1);
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { comments: true },
        });
        // 결과 검증
        expect(result).toEqual(article1);
    });

    it("access wrong article", async() => {
        //데이터 로직작성
        // 모의 데이터 설정
        const wrongId = 999;
        // 예상 리턴값
        mockMethod.article.findUnique.mockResolvedValue(null);
        // 서비스 메서드 호출
        const resultPromise = articleService.accessArticle(wrongId);
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findUnique).toHaveBeenCalledWith({
            where: {id: wrongId},
            include: {comments: true},
        });
        // 결과 검증
        await expect (resultPromise).rejects.toThrow("해당 게시글이 존재하지 않습니다");
    });

    it("access article list successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const articlesArray = [mockData.article1, mockData.article2];
        const query = { take: 10, page: 1, keyword: "test" };
        // 예상 리턴값 작성
        mockMethod.article.findMany.mockResolvedValue(articlesArray);
        // 서비스 메서드 호출
        const result = await articleService.accessArticleList(query);
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findMany).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                skip: 0,
                take: 10,
                where: expect.objectContaining({
                    OR: [
                        { title: { contains: "test" } },
                        { content: { contains: "test" } },
                    ],
                }),
                orderBy: { createdAt: "desc" }
            })
        );  
        // 결과 검증    
        expect(result).toEqual(articlesArray);
    });
    it("access wrong article list", async() => {
        //데이터 로직작성
        // 모의 데이터 설정
        const articlesArray = [mockData.article1, mockData.article2];
        const query = { take: 10, page: 1, keyword: "nonexistent" };
        // 예상 리턴값
        mockMethod.article.findMany.mockResolvedValue([]);
        // 서비스 메서드 호출
        const resultPromise = articleService.accessArticleList(query);
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findMany).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                skip: 0,
                take: 10,
                where: expect.objectContaining({
                    OR: [
                        { title: { contains: "nonexistent" } },
                        { content: { contains: "nonexistent" } },
                    ],
                }),
                orderBy: { createdAt: "desc" }
            })
        );
        // 결과 검증
        await expect (resultPromise).resolves.toEqual([]);
    });

    it("create article successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const newArticle = {
            id: 3,
            title: "New Article",
            content: "This is a new article.",
            createdAt: new Date(),
            ownerId: 1,
            comments: [],
        }
        // 예상 리턴값 작성
        console.log("newArticle:", newArticle);
        mockMethod.article.create.mockResolvedValue(newArticle);
        // 서비스 매서드 호출
        const resultPromise = articleService.createArticle(1, newArticle);
        // 모의 함수 호출 여부 및 인자 검증
       
        expect(mockMethod.article.create).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.create).toHaveBeenCalledWith({
            data: {
                title: newArticle.title,
                content: newArticle.content,
                ownerId: 1,
                comments: {},
            },
              include: { comments: true },
        });
         // 결과 검증
    
         const result = await articleService.createArticle(1, newArticle);
        expect(result).toEqual(newArticle);
    });

     it("fail to create article ", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const newArticle = {
            id: 3,
            title: "New Article",
            content: "This is a new article.",
            createdAt: new Date(),
            ownerId: 1,
            comments: [],
        }
        // 예상 리턴값 작성
        mockMethod.article.create.mockRejectedValue(new Error("Database error"));
        // 서비스 매서드 호출
        const resultPromise = articleService.createArticle(1, newArticle);
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.create).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.create).toHaveBeenCalledWith({
            data:{
                title: newArticle.title,
                content: newArticle.content,
                ownerId: 1,
                comments:{},
            },
            include: {comments:true},
        });
        // 결과 검증 
        await expect(resultPromise).rejects.toThrow("Database error");
     });
    it("patch article successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const {article1} = mockData;
        const updatedData = {
            title: "Updated Title",
            content: "Updated Content",
            ownerId: 1,
        }
        // 예상 리턴값 작성
        mockMethod.article.findUnique.mockResolvedValue(article1);

        mockMethod.article.update.mockResolvedValue({
            ...article1,
            ...updatedData
        });

        // 서비스 매서드 호출
        const result = await articleService.modifyArticle(1, 1, updatedData);
        // 모의 함수 호출 여부 및 인자 검증
        expect (mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.update).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.update).toHaveBeenCalledWith({
            where: {id:1},
            data: {
                title: updatedData.title,
                content: updatedData.content,
                ownerId:1,
            },
        });
         // 결과 검증
        expect(result).toEqual({
            ...article1,
            ...updatedData
        });
    });

    it("fail patch article ", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const {article1} = mockData;
        const updatedData = {
            title: "Updated Title",
            content: "Updated Content",
            ownerId: 1,
            }
        // 존재하지 않는 article ID
        const wrongId = 999;
        
        // 예상 리턴값 작성
        mockMethod.article.findUnique.mockResolvedValue(null)
        // 서비스 매서드 호출
      await expect(articleService.modifyArticle(wrongId, 1, updatedData)).rejects.toThrow("해당 게시글이 존재하지 않습니다");
        //  모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findUnique).toHaveBeenCalledWith({
            where:{id: wrongId},
            include:{comments:true}
        });
        // 결과 검증
        expect(mockMethod.article.update).toHaveBeenCalledTimes(0);
    });
    
     it("delete article successfully", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const {article1} = mockData;
        // 예상 리턴값 작성
        mockMethod.article.findUnique.mockResolvedValue(article1);
        mockMethod.article.delete.mockResolvedValue(article1);
        // 서비스 매서드 호출
        const result = await articleService.deleteArticle(1, 1)
        // 모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{comments:true}
        });
        expect(mockMethod.article.delete).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.delete).toHaveBeenCalledWith({
            where:{id:1}
        })
        // 결과 검증
        expect(result).toEqual(article1);
    });

    it("fail delete article ", async () => {
        // 테스트 로직 작성
        // 모의 데이터 설정
        const wrongId = 999;
        // 존재하지 않는 article ID
        mockMethod.article.findUnique.mockResolvedValue(null);
        // 예상 리턴값 작성
        // 서비스 매서드 호출
          const resultPromise = articleService.deleteArticle (wrongId, 1);
        //  모의 함수 호출 여부 및 인자 검증
        expect(mockMethod.article.findUnique).toHaveBeenCalledTimes(1);
        expect(mockMethod.article.findUnique).toHaveBeenCalledWith({
            where:{id: wrongId},
            include:{comments:true}
        });
        expect(mockMethod.article.delete).toHaveBeenCalledTimes(0);
        // 결과 검증
        await expect(resultPromise).rejects.toThrow("해당 게시글이 존재 하지 않습니다");        
        })
        // 결과 검증});
});

