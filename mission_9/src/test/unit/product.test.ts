import { jest } from "@jest/globals";

const mockCreateProductFunction = jest.fn();

jest.unstable_mockModule("../../repository/productRepository.js", () => ({
  createProduct: mockCreateProductFunction,
}));

const { createProduct: createProductService } = await import(
  "../../services/productService.js"
);

describe("Product Service Unit Test", () => {
  describe("createProduct", () => {
    const mockCreateProductRepo = mockCreateProductFunction;

    afterEach(() => {
      mockCreateProductRepo.mockClear();
    });

    it("should call repository and return the created product", async () => {
      const mockProductData = {
        userId: 1,
        name: "Test Product",
        description: "This is a test product.",
        price: 10000,
        tags: ["test"],
      };

      const mockCreatedProduct = {
        id: 123,
        ...mockProductData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateProductRepo.mockResolvedValue(mockCreatedProduct);

      const result = await createProductService(mockProductData);

      expect(mockCreateProductRepo).toHaveBeenCalledTimes(1);
      expect(mockCreateProductRepo).toHaveBeenCalledWith(mockProductData);
      expect(result).toEqual(mockCreatedProduct);
    });
  });
});