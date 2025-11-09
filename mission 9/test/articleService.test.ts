// mock 선언은 import보다 위에 있어야 함
jest.mock("../src/repositories/articleRepository", () => {
  return {
    ArticleRepository: jest.fn().mockImplementation(() => ({
      createArticle: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      updatedArticle: jest.fn(),
      deleteArticle: jest.fn(),
    })),
  };
});

import articleService, { ArticleService } from "../src/services/articleService";
import { ArticleRepository } from "../src/repositories/articleRepository";

// 타입 추론을 위해 any 대신 명시적 타입 사용
const repoMock = new ArticleRepository() as jest.Mocked<ArticleRepository>;

describe("ArticleService", () => {
  const mockArticle = {
    id: 1,
    userId: 1,
    title: "테스트 제목",
    content: "테스트 내용",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // articleService 내부 repo를 mock으로 덮어씀
    (articleService as any).repo = repoMock;
  });

  it("should create an article", async () => {
    repoMock.createArticle.mockResolvedValue(mockArticle);

    const result = await articleService.create(1, {
      title: "테스트 제목",
      content: "테스트 내용",
    });

    expect(result).toEqual(mockArticle);
    expect(repoMock.createArticle).toHaveBeenCalledWith({
      title: "테스트 제목",
      content: "테스트 내용",
      userId: 1,
    });
  });

  it("should list articles with pagination and keyword", async () => {
    repoMock.findMany.mockResolvedValue([mockArticle]);

    const result = await articleService.list({
      page: 1,
      pageSize: 10,
      keyword: "테스트",
    });

    expect(result).toEqual([mockArticle]);
    expect(repoMock.findMany).toHaveBeenCalled();
  });

  it("should get detail of an article", async () => {
    repoMock.findById.mockResolvedValue(mockArticle);

    const result = await articleService.getDetail(1);

    expect(result).toEqual(mockArticle);
    expect(repoMock.findById).toHaveBeenCalledWith(1);
  });

  it("should update article if user owns it", async () => {
    repoMock.findById.mockResolvedValue(mockArticle);
    repoMock.updatedArticle.mockResolvedValue({
      ...mockArticle,
      title: "수정된 제목",
    });

    const result = await articleService.update(1, { title: "수정된 제목" }, 1);

    expect(result.title).toBe("수정된 제목");
    expect(repoMock.updatedArticle).toHaveBeenCalledWith(1, {
      title: "수정된 제목",
    });
  });

  it("should throw FORBIDDEN if another user tries to update", async () => {
    repoMock.findById.mockResolvedValue({ ...mockArticle, userId: 999 });

    await expect(
      articleService.update(1, { title: "수정된 제목" }, 1)
    ).rejects.toThrow("FORBIDDEN");
  });

  it("should throw NOT_FOUND if article does not exist on update", async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(
      articleService.update(1, { title: "없는 글" }, 1)
    ).rejects.toThrow("NOT_FOUND");
  });

  it("should delete article if user owns it", async () => {
    repoMock.findById.mockResolvedValue(mockArticle);
    repoMock.deleteArticle.mockResolvedValue(undefined);

    await articleService.delete(1, 1);

    expect(repoMock.deleteArticle).toHaveBeenCalledWith(1);
  });

  it("should throw FORBIDDEN if another user tries to delete", async () => {
    repoMock.findById.mockResolvedValue({ ...mockArticle, userId: 999 });

    await expect(articleService.delete(1, 1)).rejects.toThrow("FORBIDDEN");
  });

  it("should throw NOT_FOUND if article not found on delete", async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(articleService.delete(1, 1)).rejects.toThrow("NOT_FOUND");
  });
});
