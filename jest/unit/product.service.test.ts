import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// ESM 환경에서 mock 설정
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  like: {
    findMany: jest.fn(),
  },
};

const mockCreateNotification = jest.fn();
const mockSendNotificationToUser = jest.fn();

// unstable_mockModule을 사용하여 ESM 모듈 mock
jest.unstable_mockModule('../../prisma/prisma.js', () => ({
  __esModule: true,
  default: mockPrisma,
  prisma: mockPrisma,
}));

jest.unstable_mockModule('../../services/notification.service.js', () => ({
  createNotification: mockCreateNotification,
}));

jest.unstable_mockModule('../../app.js', () => ({
  sendNotificationToUser: mockSendNotificationToUser,
}));

// mock 적용 후 동적 import
const { productRegisterService, productPutService, productDeleteService, prodcutListupService } = 
  await import('../../services/product.service.js');
const { HttpError } = await import('../../middlewares/errorHandler.middleware.js');

describe("상품 서비스 유닛 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("productRegisterService - 상품 등록", () => {
    it("유효한 데이터로 상품을 등록해야 함", async () => {
      const mockProduct = {
        id: 1,
        price: 10000,
        title: "테스트 상품",
        content: "테스트 내용",
        image: null,
        tags: [],
        createdAt: new Date(),
      };

      (mockPrisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRegisterService(1, 10000, "테스트 상품", "테스트 내용");

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          title: "테스트 상품",
          price: 10000,
          content: "테스트 내용",
          image: null,
          tags: [],
          userId: 1,
        },
        select: {
          id: true,
          price: true,
          title: true,
          content: true,
          image: true,
          tags: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it("제목이 없으면 HttpError를 던져야 함", async () => {
      await expect(
        productRegisterService(1, 10000, "", "테스트 내용")
      ).rejects.toThrow(HttpError);

      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });

    it("내용이 없으면 HttpError를 던져야 함", async () => {
      await expect(
        productRegisterService(1, 10000, "테스트 상품", "")
      ).rejects.toThrow(HttpError);

      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });

    it("가격이 없으면 HttpError를 던져야 함", async () => {
      await expect(
        productRegisterService(1, 0, "테스트 상품", "테스트 내용")
      ).rejects.toThrow(HttpError);

      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });
  });

  describe("prodcutListupService - 상품 목록 조회", () => {
    it("상품 목록을 반환해야 함", async () => {
      const mockProducts = [
        {
          id: 1,
          price: 10000,
          title: "상품1",
          content: "내용1",
          image: null,
          tags: [],
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          price: 20000,
          title: "상품2",
          content: "내용2",
          image: null,
          tags: [],
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await prodcutListupService();

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          price: true,
          title: true,
          content: true,
          image: true,
          tags: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockProducts);
    });

    it("상품이 없으면 HttpError를 던져야 함", async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);

      await expect(prodcutListupService()).rejects.toThrow(HttpError);
      expect(mockPrisma.product.findMany).toHaveBeenCalled();
    });
  });

  describe("productPutService - 상품 수정", () => {
    const mockProduct = {
      id: 1,
      userId: 1,
      price: 10000,
      title: "기존 상품",
      content: "기존 내용",
      image: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("소유자가 상품을 수정할 수 있어야 함", async () => {
      const updatedProduct = {
        ...mockProduct,
        title: "수정된 상품",
        content: "수정된 내용",
        price: 10000, // 가격 동일 (알림 X)
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockPrisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await productPutService(1, 1, 10000, "수정된 상품", "수정된 내용");

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: "수정된 상품",
          price: 10000,
          content: "수정된 내용",
        },
        select: {
          id: true,
          price: true,
          title: true,
          content: true,
          image: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(updatedProduct);
    });

    it("존재하지 않는 상품을 수정하려고 하면 HttpError를 던져야 함", async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        productPutService(1, 999, 20000, "수정된 상품", "수정된 내용")
      ).rejects.toThrow(HttpError);

      expect(mockPrisma.product.update).not.toHaveBeenCalled();
    });

    it("다른 사용자가 상품을 수정하려고 하면 HttpError를 던져야 함", async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        userId: 2, // 다른 사용자
      });

      await expect(
        productPutService(1, 1, 20000, "수정된 상품", "수정된 내용")
      ).rejects.toThrow(HttpError);

      expect(mockPrisma.product.update).not.toHaveBeenCalled();
    });

    it("가격이 변경되면 좋아요한 사용자들에게 알림을 보내야 함", async () => {
      const updatedProduct = {
        ...mockProduct,
        price: 20000, // 가격 변경
        title: "수정된 상품",
      };

      const mockLikes = [
        { id: 1, userId: 2, productId: 1 },
        { id: 2, userId: 3, productId: 1 },
      ];

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockPrisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);
      (mockPrisma.like.findMany as jest.Mock).mockResolvedValue(mockLikes);
      mockCreateNotification.mockResolvedValue({});
      mockSendNotificationToUser.mockReturnValue(undefined);

      await productPutService(1, 1, 20000, "수정된 상품", "수정된 내용");

      // 좋아요한 사용자 수만큼 알림 생성 및 전송
      expect(mockPrisma.like.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
      expect(mockCreateNotification).toHaveBeenCalledTimes(2);
      expect(mockSendNotificationToUser).toHaveBeenCalledTimes(2);

      // 첫 번째 사용자 알림 확인 (updatedProduct.title 사용)
      expect(mockCreateNotification).toHaveBeenNthCalledWith(1, {
        userId: 2,
        type: "PRICE_CHANGE",
        message: `상품 수정된 상품의 가격이 10000에서 20000로 변경되었습니다.`,
        productId: 1,
        postId: null,
      });

      // 두 번째 사용자 알림 확인
      expect(mockCreateNotification).toHaveBeenNthCalledWith(2, {
        userId: 3,
        type: "PRICE_CHANGE",
        message: `상품 수정된 상품의 가격이 10000에서 20000로 변경되었습니다.`,
        productId: 1,
        postId: null,
      });
    });

    it("가격이 변경되지 않으면 알림을 보내지 않아야 함", async () => {
      const updatedProduct = {
        ...mockProduct,
        price: 10000, // 가격 동일
        title: "수정된 상품",
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockPrisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

      await productPutService(1, 1, 10000, "수정된 상품", "수정된 내용");

      expect(mockPrisma.like.findMany).not.toHaveBeenCalled();
      expect(mockCreateNotification).not.toHaveBeenCalled();
      expect(mockSendNotificationToUser).not.toHaveBeenCalled();
    });
  });

  describe("productDeleteService - 상품 삭제", () => {
    const mockProduct = {
      id: 1,
      userId: 1,
      price: 10000,
      title: "삭제될 상품",
      content: "내용",
      image: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("소유자가 상품을 삭제할 수 있어야 함", async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockPrisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productDeleteService(1, 1);

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProduct);
    });

    it("존재하지 않는 상품을 삭제하려고 하면 HttpError를 던져야 함", async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(productDeleteService(1, 999)).rejects.toThrow(HttpError);

      expect(mockPrisma.product.delete).not.toHaveBeenCalled();
    });

    it("다른 사용자가 상품을 삭제하려고 하면 HttpError를 던져야 함", async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...mockProduct,
        userId: 2, // 다른 사용자
      });

      await expect(productDeleteService(1, 1)).rejects.toThrow(HttpError);

      expect(mockPrisma.product.delete).not.toHaveBeenCalled();
    });
  });
});
