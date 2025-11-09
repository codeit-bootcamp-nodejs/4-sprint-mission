// --- mock setup (import보다 위에 위치해야 함) ---
jest.mock("../src/repositories/commentRepository", () => ({
  CommentRepository: jest.fn().mockImplementation(() => ({
    createArticleComment: jest.fn(),
    createProductComment: jest.fn(),
    findById: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
    findProductComments: jest.fn(),
    findArticleComments: jest.fn(),
  })),
}));

jest.mock("../src/repositories/articleRepository", () => ({
  ArticleRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  })),
}));

jest.mock("../src/repositories/productRepository", () => ({
  ProductRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  })),
}));

jest.mock("../src/services/alertService", () => ({
  AlertService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
  })),
}));

// --- imports ---
import { CommentService } from "../src/services/commentService";
import { CommentRepository } from "../src/repositories/commentRepository";
import { ArticleRepository } from "../src/repositories/articleRepository";
import { ProductRepository } from "../src/repositories/productRepository";
import { AlertService } from "../src/services/alertService";

// --- mocks ---
const commentRepoMock = new CommentRepository() as jest.Mocked<CommentRepository>;
const articleRepoMock = new ArticleRepository() as jest.Mocked<ArticleRepository>;
const productRepoMock = new ProductRepository() as jest.Mocked<ProductRepository>;
const alertServiceMock = new AlertService() as jest.Mocked<AlertService>;

describe("CommentService", () => {
  let service: CommentService;

  const mockComment = {
    id: 1,
    userId: 1,
    content: "테스트 댓글",
    articleId: 1,
    productId: null,
    createdAt: new Date(),
  };

  const mockArticle = {
    id: 1,
    userId: 2,
    title: "게시글 제목",
    content: "내용",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: 1,
    userId: 2,
    name: "상품 이름",
    description: "상품 설명",
    price: 1000,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommentService();

    // service 내부 repo 교체
    (service as any).repo = commentRepoMock;
    (service as any).articleRepo = articleRepoMock;
    (service as any).productRepo = productRepoMock;
    (service as any).alertService = alertServiceMock;
  });

  // ✅ Article 댓글 생성 테스트
  it("should create article comment and trigger alert to article owner", async () => {
    commentRepoMock.createArticleComment.mockResolvedValue(mockComment);
    articleRepoMock.findById.mockResolvedValue(mockArticle);

    const result = await service.createArticleComment(1, 1, "테스트 댓글");

    expect(result).toEqual(mockComment);
    expect(commentRepoMock.createArticleComment).toHaveBeenCalledWith(1, 1, "테스트 댓글");
    expect(alertServiceMock.create).toHaveBeenCalledWith(
      2,
      "내 게시글에 새로운 댓글이 달렸습니다.",
      "/articles/1"
    );
  });

  it("should not trigger alert if commenter is article owner", async () => {
    articleRepoMock.findById.mockResolvedValue({ ...mockArticle, userId: 1 });
    commentRepoMock.createArticleComment.mockResolvedValue(mockComment);

    await service.createArticleComment(1, 1, "테스트 댓글");

    expect(alertServiceMock.create).not.toHaveBeenCalled();
  });

  // ✅ Product 댓글 생성 테스트
  it("should create product comment and trigger alert to product owner", async () => {
    commentRepoMock.createProductComment.mockResolvedValue(mockComment);
    productRepoMock.findById.mockResolvedValue(mockProduct);

    const result = await service.createProductComment(1, 1, "테스트 댓글");

    expect(result).toEqual(mockComment);
    expect(alertServiceMock.create).toHaveBeenCalledWith(
      2,
      "내 판매글에 새로운 댓글이 달렸습니다.",
      "/products/1"
    );
  });

  it("should not trigger alert if commenter is product owner", async () => {
    productRepoMock.findById.mockResolvedValue({ ...mockProduct, userId: 1 });
    commentRepoMock.createProductComment.mockResolvedValue(mockComment);

    await service.createProductComment(1, 1, "테스트 댓글");

    expect(alertServiceMock.create).not.toHaveBeenCalled();
  });

  // ✅ 댓글 수정 테스트
  it("should update comment if user owns it", async () => {
    commentRepoMock.findById.mockResolvedValue(mockComment);
    commentRepoMock.updateComment.mockResolvedValue({
      ...mockComment,
      content: "수정된 댓글",
    });

    const result = await service.updateComment(1, 1, "수정된 댓글");

    expect(result.content).toBe("수정된 댓글");
    expect(commentRepoMock.updateComment).toHaveBeenCalledWith(1, "수정된 댓글");
  });

  it("should throw FORBIDDEN if another user tries to update", async () => {
    commentRepoMock.findById.mockResolvedValue({ ...mockComment, userId: 999 });

    await expect(service.updateComment(1, 1, "수정된 댓글")).rejects.toThrow("FORBIDDEN");
  });

  it("should throw NOT_FOUND if comment does not exist on update", async () => {
    commentRepoMock.findById.mockResolvedValue(null);

    await expect(service.updateComment(1, 1, "없음")).rejects.toThrow("NOT_FOUND");
  });

  // ✅ 댓글 삭제 테스트
  it("should delete comment if user owns it", async () => {
    commentRepoMock.findById.mockResolvedValue(mockComment);
    commentRepoMock.deleteComment.mockResolvedValue(undefined as any);

    await service.deleteComment(1, 1);

    expect(commentRepoMock.deleteComment).toHaveBeenCalledWith(1);
  });

  it("should throw FORBIDDEN if another user tries to delete", async () => {
    commentRepoMock.findById.mockResolvedValue({ ...mockComment, userId: 999 });

    await expect(service.deleteComment(1, 1)).rejects.toThrow("FORBIDDEN");
  });

  it("should throw NOT_FOUND if comment not found on delete", async () => {
    commentRepoMock.findById.mockResolvedValue(null);

    await expect(service.deleteComment(1, 1)).rejects.toThrow("NOT_FOUND");
  });

  // ✅ 댓글 목록 조회 테스트
  it("should get product comments", async () => {
    commentRepoMock.findProductComments.mockResolvedValue([mockComment]);

    const result = await service.getProductComments(1);

    expect(result).toEqual([mockComment]);
    expect(commentRepoMock.findProductComments).toHaveBeenCalledWith(1, undefined);
  });

  it("should get article comments", async () => {
    commentRepoMock.findArticleComments.mockResolvedValue([mockComment]);

    const result = await service.getArticleComments(1);

    expect(result).toEqual([mockComment]);
    expect(commentRepoMock.findArticleComments).toHaveBeenCalledWith(1, undefined);
  });
});
