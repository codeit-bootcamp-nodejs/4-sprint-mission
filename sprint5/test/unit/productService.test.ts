// Mock: 모든 의존성(Repository, Utility)을 Mocking합니다.
const mockProductRepository = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  findLikedProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

const mockLikeRepository = {
  getUsersWhoLikedProduct: jest.fn(),
};

const mockNotificationRepository = {
  createNotification: jest.fn(),
};

const mockEmitToUser = jest.fn();

// 실제 파일 경로에 맞춰 Mocking을 적용합니다.
// productService와 동일한 경로 깊이를 가정하여 import 경로를 설정합니다.
jest.mock("../../repositories/productRepository", () => ({
  productRepository: mockProductRepository,
}));
jest.mock("../../repositories/likeRepository", () => ({
  likeRepository: mockLikeRepository,
}));
jest.mock("../../repositories/notificationRepository", () => ({
  notificationRepository: mockNotificationRepository,
}));
jest.mock("../../utils/notificationSocket", () => ({
  emitToUser: mockEmitToUser,
}));

// 필요한 타입 임포트 (이전에 'implicit any' 오류 해결을 위해 추가됨)
import type { Like, Product, ProductWithLike } from "../../types/dto";

// 테스트 대상 서비스 임포트 (Mock이 적용된 상태로 임포트됩니다)
import { productService } from "../../services/productService";

// 테스트에 필요한 기본 타입 정의 (HttpError는 Mock 에러로 대체)
interface HttpError extends Error {
  status: number;
}

// Mock 데이터 설정
const mockUser = { id: 1, email: "user@test.com", nickname: "tester" };
const mockProduct = {
  id: 100,
  name: "Original Product",
  description: "Desc",
  price: 50000,
  tags: ["tag1"],
  userId: mockUser.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const mockLike = { id: 1, userId: mockUser.id, productId: mockProduct.id };

describe("ProductService Unit Tests (Mock, Spy 활용)", () => {
  // 매 테스트 전에 모든 Mock 함수를 초기화합니다.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. getProducts (상품 목록 조회)
  describe("getProducts", () => {
    it("상품 목록 조회 성공 시, isLiked가 정확히 매핑되어 반환되어야 한다 (인증됨)", async () => {
      const products = [
        { ...mockProduct, id: 1 },
        { ...mockProduct, id: 2 },
      ];
      const likedProducts = [{ productId: 1 }]; // 1번 상품만 좋아요 누름

      mockProductRepository.getProducts.mockResolvedValue(products);
      mockProductRepository.findLikedProducts.mockResolvedValue(likedProducts);

      const result = await productService.getProducts(
        0,
        10,
        undefined,
        undefined,
        mockUser.id
      );

      //Spy 검증: findLikedProducts가 호출되었는지 확인
      expect(mockProductRepository.findLikedProducts).toHaveBeenCalledWith(
        mockUser.id,
        [1, 2]
      );
      // isLiked 매핑 검증
      expect(result).toHaveLength(2);

      // 'p'에 ProductWithLike 타입을 명시적으로 지정
      expect(result.find((p: ProductWithLike) => p.id === 1)?.isLiked).toBe(
        true
      );
      expect(result.find((p: ProductWithLike) => p.id === 2)?.isLiked).toBe(
        false
      );
    });

    it("상품 목록 조회 성공 시, isLiked가 false로 반환되어야 한다 (비인증)", async () => {
      const products = [mockProduct];

      mockProductRepository.getProducts.mockResolvedValue(products);

      const result = await productService.getProducts(
        0,
        10,
        undefined,
        undefined,
        null
      );

      // Spy 검증: 비인증 상태이므로 findLikedProducts가 호출되지 않아야 함
      expect(mockProductRepository.findLikedProducts).not.toHaveBeenCalled();

      // 오류 해결 핵심: 배열 길이를 먼저 검증합니다.
      expect(result).toHaveLength(1);

      // 이제 TypeScript는 result[0]이 undefined가 아님을 확신합니다.
      expect(result[0]!.isLiked).toBe(false);
    });

    it("상품이 없을 경우 404 HttpError를 throw 해야 한다.", async () => {
      mockProductRepository.getProducts.mockResolvedValue([]);

      // 404 에러가 발생하는지 확인
      await expect(
        productService.getProducts(0, 10, undefined, undefined, null)
      ).rejects.toHaveProperty("status", 404);
    });
  });

  // 2. updateProduct (상품 수정 및 알림 로직)
  describe("updateProduct", () => {
    const newPrice = 70000;
    const newName = "Updated Name";
    const updatedProduct = { ...mockProduct, price: newPrice, name: newName };

    beforeEach(() => {
      // 기본적으로 상품을 찾았다고 가정
      mockProductRepository.getProductById.mockResolvedValue(mockProduct);
    });

    it("상품 수정 성공 시, Repository가 올바른 인자로 호출되어야 한다 (가격 변경 없음)", async () => {
      const samePrice = mockProduct.price;
      const sameUpdatedProduct = {
        ...mockProduct,
        name: newName,
        price: samePrice,
      };

      mockProductRepository.updateProduct.mockResolvedValue(sameUpdatedProduct);

      await productService.updateProduct(
        mockProduct.id,
        newName,
        undefined,
        samePrice,
        undefined,
        mockUser.id
      );

      // Spy 검증 1: updateProduct가 호출되었는지 확인
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(
        mockProduct.id,
        newName,
        undefined,
        samePrice,
        undefined
      );
      // Spy 검증 2: 가격 변경이 없으므로 알림 관련 함수는 호출되지 않아야 함
      expect(mockLikeRepository.getUsersWhoLikedProduct).not.toHaveBeenCalled();
      expect(
        mockNotificationRepository.createNotification
      ).not.toHaveBeenCalled();
      expect(mockEmitToUser).not.toHaveBeenCalled();
    });

    it("가격이 변경되었을 때, 알림 생성 및 실시간 알림 전송 로직이 실행되어야 한다.", async () => {
      // 1. 상품을 찾아 반환 (oldPrice = 50000)
      mockProductRepository.getProductById.mockResolvedValue(mockProduct);
      // 2. 업데이트된 상품 반환 (newPrice = 70000)
      mockProductRepository.updateProduct.mockResolvedValue(updatedProduct);

      // 3. 좋아요한 사용자 목록 Mock (2명의 사용자)
      const likedUsersMock = [
        { user: { id: 200, email: "like1@test.com" } },
        { user: { id: 201, email: "like2@test.com" } },
      ];
      mockLikeRepository.getUsersWhoLikedProduct.mockResolvedValue(
        likedUsersMock
      );

      await productService.updateProduct(
        mockProduct.id,
        newName,
        undefined,
        newPrice,
        undefined,
        mockUser.id
      );

      // Spy 검증 1: 좋아요 사용자 목록 조회 호출
      expect(mockLikeRepository.getUsersWhoLikedProduct).toHaveBeenCalledWith(
        mockProduct.id
      );

      // Spy 검증 2: 각 사용자(2명)에게 알림 생성 호출 확인
      expect(
        mockNotificationRepository.createNotification
      ).toHaveBeenCalledTimes(2);
      expect(
        mockNotificationRepository.createNotification
      ).toHaveBeenCalledWith({
        userId: 200,
        type: "PRICE_CHANGE",
        message: `좋아요한 상품 "Updated Name"의 가격이 50000원 → 70000원으로 변경되었습니다.`,
        targetId: mockProduct.id,
      });

      // Spy 검증 3: 각 사용자(2명)에게 실시간 알림 전송 호출 확인
      expect(mockEmitToUser).toHaveBeenCalledTimes(2);
      expect(mockEmitToUser).toHaveBeenCalledWith(201, {
        type: "PRICE_CHANGE",
        productId: mockProduct.id,
        message: `좋아요한 상품 "Updated Name"의 가격이 50000원 → 70000원으로 변경되었습니다.`,
      });
    });

    it("상품이 없을 경우 404 HttpError를 throw 해야 한다.", async () => {
      mockProductRepository.getProductById.mockResolvedValue(null);

      await expect(
        productService.updateProduct(
          999,
          newName,
          undefined,
          newPrice,
          undefined,
          mockUser.id
        )
      ).rejects.toHaveProperty("status", 404);
    });

    it("다른 사용자가 수정을 시도할 경우 403 HttpError를 throw 해야 한다. (권한 검사)", async () => {
      const unauthorizedUserId = 999;
      // 상품은 User 1의 것
      mockProductRepository.getProductById.mockResolvedValue(mockProduct);

      // User 999가 수정 시도
      await expect(
        productService.updateProduct(
          mockProduct.id,
          newName,
          undefined,
          newPrice,
          undefined,
          unauthorizedUserId
        )
      ).rejects.toHaveProperty("status", 403);
    });
  });

  // ------------------------------------------------------------------
  // 3. deleteProduct (상품 삭제)
  // ------------------------------------------------------------------
  describe("deleteProduct", () => {
    it("상품 삭제 성공 시, productRepository.deleteProduct가 호출되어야 한다.", async () => {
      // 1. 상품을 찾아 반환 (성공)
      mockProductRepository.getProductById.mockResolvedValue(mockProduct);
      // 2. 삭제 Mock
      mockProductRepository.deleteProduct.mockResolvedValue(undefined);

      await productService.deleteProduct(mockProduct.id, mockUser.id);

      // Spy 검증: deleteProduct가 올바른 ID로 호출되었는지 확인
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(
        mockProduct.id
      );
    });

    it("다른 사용자가 삭제를 시도할 경우 403 HttpError를 throw 해야 한다. (권한 검사)", async () => {
      const unauthorizedUserId = 999;
      mockProductRepository.getProductById.mockResolvedValue(mockProduct); // 상품은 User 1의 것

      await expect(
        productService.deleteProduct(mockProduct.id, unauthorizedUserId)
      ).rejects.toHaveProperty("status", 403);

      // Spy 검증: 권한 실패로 deleteProduct는 호출되지 않아야 함
      expect(mockProductRepository.deleteProduct).not.toHaveBeenCalled();
    });
  });
});
