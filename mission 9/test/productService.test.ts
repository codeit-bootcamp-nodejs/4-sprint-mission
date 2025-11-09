// ✅ 1. 반드시 import보다 위에 있어야 함
jest.mock("../src/repositories/productRepository", () => {
  return {
    ProductRepository: jest.fn().mockImplementation(() => ({
      createProduct: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    })),
  };
});

import { ProductService } from "../src/services/productService";
import { ProductRepository } from "../src/repositories/productRepository";

describe("ProductService", () => {
  let service: ProductService;
  let repoMock: jest.Mocked<ProductRepository>;

  const mockProduct = {
    id: 1,
    name: "Laptop",
    description: "Fast laptop",
    price: 2000,
    tags: "tech",
    userId: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService();
    repoMock = service["repo"] as jest.Mocked<ProductRepository>;
  });

  // ✅ create
  it("should create a new product", async () => {
    const input = { name: "Phone", description: "Smartphone", price: 1000, tags: "mobile" };
    const created = { ...mockProduct, ...input, id: 2 };
    repoMock.createProduct.mockResolvedValue(created as any);

    const result = await service.create(10, input);

    expect(repoMock.createProduct).toHaveBeenCalledWith({ ...input, userId: 10 });
    expect(result).toEqual(created);
  });

  // ✅ list
  it("should list products with keyword filter", async () => {
    repoMock.findMany.mockResolvedValue([mockProduct] as any);

    const result = await service.list({ page: 1, pageSize: 10, keyword: "Laptop" });

    expect(repoMock.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockProduct]);
  });

  // ✅ getDetail
  it("should get product detail", async () => {
    repoMock.findById.mockResolvedValue(mockProduct as any);

    const result = await service.getDetail(1);

    expect(repoMock.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockProduct);
  });

  // ✅ update - success
  it("should update product if user owns it", async () => {
    repoMock.findById.mockResolvedValue(mockProduct as any);
    const updated = { ...mockProduct, name: "Updated Laptop" };
    repoMock.updateProduct.mockResolvedValue(updated as any);

    const result = await service.update(10, 1, { name: "Updated Laptop" });

    expect(repoMock.findById).toHaveBeenCalledWith(1);
    expect(repoMock.updateProduct).toHaveBeenCalledWith(1, { name: "Updated Laptop" });
    expect(result).toEqual(updated);
  });

  // ✅ update - not found
  it("should throw NOT_FOUND when product not found", async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(service.update(10, 1, { name: "Updated" })).rejects.toThrow("NOT_FOUND");
  });

  // ✅ update - forbidden
  it("should throw FORBIDDEN when user does not own product", async () => {
    repoMock.findById.mockResolvedValue({ ...mockProduct, userId: 99 } as any);

    await expect(service.update(10, 1, { name: "Updated" })).rejects.toThrow("FORBIDDEN");
  });

  // ✅ delete - success
  it("should delete product if user owns it", async () => {
    repoMock.findById.mockResolvedValue(mockProduct as any);
    repoMock.deleteProduct.mockResolvedValue(undefined as any);

    await service.delete(10, 1);

    expect(repoMock.findById).toHaveBeenCalledWith(1);
    expect(repoMock.deleteProduct).toHaveBeenCalledWith(1);
  });

  // ✅ delete - not found
  it("should throw NOT_FOUND if product does not exist", async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(service.delete(10, 1)).rejects.toThrow("NOT_FOUND");
  });

  // ✅ delete - forbidden
  it("should throw FORBIDDEN if user does not own product", async () => {
    repoMock.findById.mockResolvedValue({ ...mockProduct, userId: 99 } as any);

    await expect(service.delete(10, 1)).rejects.toThrow("FORBIDDEN");
  });
});
