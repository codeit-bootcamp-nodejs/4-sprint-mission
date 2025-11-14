import { ProductService } from "../src/services/productService";
import { ProductRepository } from "../src/repositories/productRepository";
import { LikeRepository } from "../src/repositories/likeRepository";
import { AlertService } from "../src/services/alertService";

jest.mock("../src/repositories/productRepository");
jest.mock("../src/repositories/likeRepository");
jest.mock("../src/services/alertService");

describe("ProductService", () => {
  let service: ProductService;
  let productRepo: jest.Mocked<ProductRepository>;
  let likeRepo: jest.Mocked<LikeRepository>;
  let alertService: jest.Mocked<AlertService>;

  beforeEach(() => {
    service = new ProductService();
    productRepo = service["repo"] as any;
    likeRepo = service["likeRepo"] as any;
    alertService = service["alertService"] as any;
  });

  it("상품 생성", async () => {
    productRepo.createProduct.mockResolvedValue({
      id: 1,
      userId: 1,
      name: "상품",
      description: "설명",
      price: 1000,
      tags: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const res = await service.create(1, {
      name: "상품",
      price: 1000,
      description: "설명",
    } as any);
    expect(res).toEqual({
      id: 1,
      userId: 1,
      name: "상품",
      description: "설명",
      price: 1000,
      tags: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(productRepo.createProduct).toHaveBeenCalled();
  });

  it("상품 가격 변경 시 알림 생성", async () => {
    const oldProduct = {
      id: 1,
      userId: 2,
      name: "상품",
      description: "테스트 상품 설명",
      price: 1000,
      tags: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productRepo.findById.mockResolvedValue(oldProduct);
    productRepo.updateProduct.mockResolvedValue({ ...oldProduct, price: 2000 });
    likeRepo.findUsersWhoLikedProduct.mockResolvedValue([
      { id: 3, nickname: "alice" },
    ]);

    await service.update(2, 1, { price: 2000 });
    expect(alertService.create).toHaveBeenCalledWith(
      3,
      expect.stringContaining("상품"),
      "/products/1"
    );
  });

  it("본인 아닌 경우 삭제 권한 검증", async () => {
    productRepo.findById.mockResolvedValue({
      id: 1,
      userId: 2,
      name: "상품",
      description: "테스트 상품 설명",
      price: 1000,
      tags: null,
      createdAt: new Date(),
    });
    await expect(service.delete(3, 1)).rejects.toThrow("FORBIDDEN");
  });
});
