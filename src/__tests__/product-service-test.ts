import { ProductService } from "../service/product-service";
import { ProductRepository } from "../repository/product-repository";
import { LikeRepository } from "../repository/like-repository";
import { NotificationService } from "../service/notification-service";

/**
 * 의존성 Mock 생성
 * jest.fn()을 사용하여 클래스의 메서드들을 가짜 함수로 만들기
 */
const mockProductRepoImpl = {
  createProduct: jest.fn(),
  findManyProducts: jest.fn(),
  countProducts: jest.fn(),
  findProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  findProductsByUserId: jest.fn(),
};
const mockProductRepository =
  mockProductRepoImpl as any as jest.Mocked<ProductRepository>;

const mockLikeRepoImpl = {
  findProductLike: jest.fn(),
  createProductLike: jest.fn(),
  deleteProductLike: jest.fn(),
  findArticleLike: jest.fn(),
  createArticleLike: jest.fn(),
  deleteArticleLike: jest.fn(),
  findUserIdsByProductId: jest.fn(),
};
const mockLikeRepository =
  mockLikeRepoImpl as any as jest.Mocked<LikeRepository>;

const mockNotifServiceImpl = {
  createAndSendNotification: jest.fn(),
  getNotifications: jest.fn(),
  getUnreadCount: jest.fn(),
  readNotification: jest.fn(),
  sendUnreadCount: jest.fn(),
  mapToResponseDto: jest.fn(), // private 메서드도 Mock 타입에 포함
};
const mockNotificationService =
  mockNotifServiceImpl as any as jest.Mocked<NotificationService>;

// 테스트 대상(SUT)인 ProductService
let productService: ProductService;

// 각 테스트가 실행되기 전에 매번 실행
beforeEach(() => {
  // 모든 Mock 함수들의 호출 기록을 초기화
  jest.clearAllMocks();

  // 'productService' 인스턴스를 가짜 의존성을 주입하여 생성
  productService = new ProductService(
    mockProductRepository,
    mockLikeRepository,
    mockNotificationService
  );
});

describe("ProductService 유닛 테스트", () => {
  const testUserId = 1;
  const testProductId = "100";
  const oldProduct = {
    id: 100,
    userId: testUserId, // 이 상품의 주인은 testUserId
    name: "Original Product",
    description: "Original Description",
    price: 10000,
    tags: ["tag1"],
    createdAt: new Date(),
    updatedAt: new Date(),
    isLiked: false,
    _count: { likes: 0 },
  };

  /**
   * updateProduct 메서드 테스트
   */
  describe("updateProduct", () => {
    it("가격이 변경되지 않으면 알림 관련 함수가 호출되지 않아야 함 (Spy)", async () => {
      // findProductById가 oldProduct를 반환하도록 Mocking
      mockProductRepository.findProductById.mockResolvedValue(oldProduct);

      const updateDto = { name: "New Product Name" }; // 가격(price) 변경 없음

      await productService.updateProduct(testUserId, testProductId, updateDto);

      // 좋아요 레포지토리가 호출되지 않았는지 확인
      expect(mockLikeRepository.findUserIdsByProductId).not.toHaveBeenCalled();

      // 알림 서비스가 호출되지 않았는지 확인
      expect(
        mockNotificationService.createAndSendNotification
      ).not.toHaveBeenCalled();

      // 상품 업데이트는 호출되어야 함
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(
        testProductId,
        updateDto
      );
    });

    it("가격이 변경되면, 상품을 좋아요한 유저(주인 제외)에게만 알림을 보내야 함 (Spy)", async () => {
      const newPrice = 15000;
      const updateDto = { price: newPrice };

      // 이 상품을 좋아요한 유저 ID 목록 (주인(1), 유저(2), 유저(3))
      const userIdsToNotify = [1, 2, 3];

      // findProductById가 oldProduct를 반환하도록 Mocking
      mockProductRepository.findProductById.mockResolvedValue(oldProduct);

      // findUserIdsByProductId가 위 유저 목록을 반환하도록 Mocking
      mockLikeRepository.findUserIdsByProductId.mockResolvedValue(
        userIdsToNotify
      );

      await productService.updateProduct(testUserId, testProductId, updateDto);

      // 좋아요 레포지토리가 올바른 상품 ID로 호출되었는지 확인
      expect(mockLikeRepository.findUserIdsByProductId).toHaveBeenCalledWith(
        oldProduct.id
      );

      // 알림 서비스가 2번만 호출되었는지 확인 (주인(1)을 제외한 2, 3)
      expect(
        mockNotificationService.createAndSendNotification
      ).toHaveBeenCalledTimes(2);

      // 알림 서비스가 올바른 유저 ID로 호출되었는지 확인
      expect(
        mockNotificationService.createAndSendNotification
      ).toHaveBeenCalledWith(
        2, // 유저 2
        expect.any(String),
        "PRICE_CHANGE",
        expect.any(String)
      );
      expect(
        mockNotificationService.createAndSendNotification
      ).toHaveBeenCalledWith(
        3, // 유저 3
        expect.any(String),
        "PRICE_CHANGE",
        expect.any(String)
      );

      // 알림 메시지에 올바른 가격 정보가 포함되었는지 확인
      expect(
        mockNotificationService.createAndSendNotification
      ).toHaveBeenCalledWith(
        expect.any(Number),
        expect.stringContaining(`${oldProduct.price}원에서 ${newPrice}원`),
        expect.any(String),
        expect.any(String)
      );

      // 상품 업데이트는 호출되어야 함
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(
        testProductId,
        updateDto
      );
    });
  });

  /**
   * deleteProduct 메서드 테스트
   */
  describe("deleteProduct", () => {
    it('상품이 존재하지 않으면 "상품을 찾을 수 없습니다." 에러를 throw해야 함', async () => {
      // findProductById가 null을 반환하도록 Mocking
      mockProductRepository.findProductById.mockResolvedValue(null);

      // productService.deleteProduct가 에러를 throw하는지 검증
      await expect(
        productService.deleteProduct(testUserId, testProductId)
      ).rejects.toThrow("상품을 찾을 수 없습니다.");
    });

    it('사용자가 상품 주인이 아니면 "상품을 삭제할 권한이 없습니다." 에러를 throw해야 함', async () => {
      const anotherUserId = 999; // 다른 유저 ID
      // findProductById가 oldProduct(주인: testUserId(1))를 반환하도록 Mocking
      mockProductRepository.findProductById.mockResolvedValue(oldProduct);

      await expect(
        productService.deleteProduct(anotherUserId, testProductId)
      ).rejects.toThrow("상품을 삭제할 권한이 없습니다.");

      // 권한이 없으므로 실제 delete 메서드는 호출되지 않아야 함
      expect(mockProductRepository.deleteProduct).not.toHaveBeenCalled();
    });

    it("사용자가 상품 주인이면 성공적으로 deleteRepository를 호출해야 함", async () => {
      // findProductById가 oldProduct(주인: testUserId(1))를 반환하도록 Mocking
      mockProductRepository.findProductById.mockResolvedValue(oldProduct);

      await productService.deleteProduct(testUserId, testProductId);

      // deleteProduct가 올바른 ID로 호출되었는지 확인
      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(
        testProductId
      );
    });
  });
});
