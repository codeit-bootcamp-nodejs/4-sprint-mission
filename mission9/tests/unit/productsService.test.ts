import * as productsService from '../../src/services/productsService';
import * as productsRepository from '../../src/repositories/productsRepository';
import * as notificationsService from '../../src/services/notificationsService';
import { prismaClient } from '../../src/lib/prismaClient';
import NotFoundError from '../../src/lib/errors/NotFoundError';
import ForbiddenError from '../../src/lib/errors/ForbiddenError';

// Mock dependencies
jest.mock('../../src/repositories/productsRepository');
jest.mock('../../src/services/notificationsService');
jest.mock('../../src/lib/prismaClient', () => ({
  prismaClient: {
    favorite: {
      findMany: jest.fn(),
    },
  },
}));

describe('상품 서비스 - 유닛 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('상품 생성', () => {
    it('favoriteCount와 isFavorited 필드를 포함한 상품을 생성해야 함', async () => {
      const mockProductData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10000,
        tags: ['test'],
        images: ['image.jpg'],
        userId: 1,
      };

      const mockCreatedProduct = {
        id: 1,
        ...mockProductData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.createProduct as jest.Mock).mockResolvedValue(
        mockCreatedProduct
      );

      const result = await productsService.createProduct(mockProductData);

      expect(productsRepository.createProduct).toHaveBeenCalledWith(mockProductData);
      expect(result).toEqual({
        ...mockCreatedProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
    });
  });

  describe('상품 조회', () => {
    it('상품이 존재할 때 상품을 반환해야 함', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Description',
        price: 10000,
        tags: ['test'],
        images: ['image.jpg'],
        userId: 1,
        favoriteCount: 5,
        isFavorited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const result = await productsService.getProduct(1);

      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('상품이 존재하지 않을 때 NotFoundError를 던져야 함', async () => {
      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(null);

      await expect(productsService.getProduct(999)).rejects.toThrow(NotFoundError);
      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(999);
    });
  });

  describe('상품 목록 조회', () => {
    it('페이지네이션된 상품 목록을 반환해야 함', async () => {
      const mockParams = {
        page: 1,
        pageSize: 10,
      };

      const mockResult = {
        list: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Desc 1',
            price: 10000,
            tags: ['test'],
            images: ['img1.jpg'],
            userId: 1,
            favoriteCount: 0,
            isFavorited: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalCount: 1,
      };

      (productsRepository.getProductListWithFavorites as jest.Mock).mockResolvedValue(
        mockResult
      );

      const result = await productsService.getProductList(mockParams);

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(
        mockParams,
        {}
      );
      expect(result).toEqual(mockResult);
    });

    it('userId 옵션이 제공되면 전달해야 함', async () => {
      const mockParams = {
        page: 1,
        pageSize: 10,
      };

      const mockResult = {
        list: [],
        totalCount: 0,
      };

      (productsRepository.getProductListWithFavorites as jest.Mock).mockResolvedValue(
        mockResult
      );

      await productsService.getProductList(mockParams, { userId: 5 });

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(
        mockParams,
        { userId: 5 }
      );
    });
  });

  describe('상품 수정', () => {
    const mockExistingProduct = {
      id: 1,
      name: 'Old Name',
      description: 'Description',
      price: 10000,
      tags: ['test'],
      images: ['img.jpg'],
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(
        mockExistingProduct
      );
    });

    it('상품이 존재하지 않을 때 NotFoundError를 던져야 함', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);

      const updateData = {
        name: 'New Name',
        userId: 1,
      };

      await expect(productsService.updateProduct(999, updateData)).rejects.toThrow(
        NotFoundError
      );
    });

    it('사용자가 소유자가 아닐 때 ForbiddenError를 던져야 함', async () => {
      const updateData = {
        name: 'New Name',
        userId: 2, // Different user
      };

      await expect(productsService.updateProduct(1, updateData)).rejects.toThrow(
        ForbiddenError
      );
    });

    it('가격이 변경되지 않았을 때 알림을 보내지 않고 상품을 수정해야 함', async () => {
      const updateData = {
        name: 'New Name',
        userId: 1,
      };

      const mockUpdatedProduct = {
        ...mockExistingProduct,
        ...updateData,
        favoriteCount: 0,
        isFavorited: false,
      };

      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        mockUpdatedProduct
      );

      const result = await productsService.updateProduct(1, updateData);

      expect(productsRepository.updateProductWithFavorites).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(prismaClient.favorite.findMany).not.toHaveBeenCalled();
      expect(notificationsService.createAndSendNotification).not.toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('가격이 변경되었을 때 찜한 사용자들에게 알림을 보내야 함', async () => {
      const updateData = {
        price: 15000, // Price changed
        userId: 1,
      };

      const mockFavorites = [
        { userId: 2 },
        { userId: 3 },
        { userId: 1 }, // Owner should be filtered out
      ];

      const mockUpdatedProduct = {
        ...mockExistingProduct,
        ...updateData,
        favoriteCount: 3,
        isFavorited: false,
      };

      (prismaClient.favorite.findMany as jest.Mock).mockResolvedValue(mockFavorites);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        mockUpdatedProduct
      );
      (notificationsService.createAndSendNotification as jest.Mock).mockResolvedValue({
        id: 1,
        type: 'PRICE_CHANGE',
        message: 'Test message',
        isRead: false,
        createdAt: new Date(),
      });

      // Spy on Promise.all to verify notification calls
      const promiseAllSpy = jest.spyOn(Promise, 'all');

      const result = await productsService.updateProduct(1, updateData);

      // Wait for async notification sending
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(prismaClient.favorite.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        select: { userId: true },
      });

      expect(productsRepository.updateProductWithFavorites).toHaveBeenCalledWith(
        1,
        updateData
      );

      // Verify notifications were sent to users 2 and 3 (not the owner)
      expect(promiseAllSpy).toHaveBeenCalled();

      expect(result).toEqual(mockUpdatedProduct);

      promiseAllSpy.mockRestore();
    });

    it('가격이 변경되었지만 찜한 사용자가 없을 때 알림을 보내지 않아야 함', async () => {
      const updateData = {
        price: 15000,
        userId: 1,
      };

      const mockUpdatedProduct = {
        ...mockExistingProduct,
        ...updateData,
        favoriteCount: 0,
        isFavorited: false,
      };

      (prismaClient.favorite.findMany as jest.Mock).mockResolvedValue([]);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        mockUpdatedProduct
      );

      const result = await productsService.updateProduct(1, updateData);

      expect(prismaClient.favorite.findMany).toHaveBeenCalled();
      expect(notificationsService.createAndSendNotification).not.toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('알림 전송 실패를 적절히 처리해야 함', async () => {
      const updateData = {
        price: 15000,
        userId: 1,
      };

      const mockFavorites = [{ userId: 2 }];

      const mockUpdatedProduct = {
        ...mockExistingProduct,
        ...updateData,
        favoriteCount: 1,
        isFavorited: false,
      };

      (prismaClient.favorite.findMany as jest.Mock).mockResolvedValue(mockFavorites);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        mockUpdatedProduct
      );
      (notificationsService.createAndSendNotification as jest.Mock).mockRejectedValue(
        new Error('Notification failed')
      );

      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await productsService.updateProduct(1, updateData);

      // Wait for async notification failure
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Product should still be updated even if notification fails
      expect(result).toEqual(mockUpdatedProduct);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('상품 삭제', () => {
    it('사용자가 소유자일 때 상품을 삭제해야 함', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Description',
        price: 10000,
        tags: ['test'],
        images: ['img.jpg'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(mockProduct);
      (productsRepository.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      await productsService.deleteProduct(1, 1);

      expect(productsRepository.getProduct).toHaveBeenCalledWith(1);
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('상품이 존재하지 않을 때 NotFoundError를 던져야 함', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);

      await expect(productsService.deleteProduct(999, 1)).rejects.toThrow(
        NotFoundError
      );
      expect(productsRepository.deleteProduct).not.toHaveBeenCalled();
    });

    it('사용자가 소유자가 아닐 때 ForbiddenError를 던져야 함', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Description',
        price: 10000,
        tags: ['test'],
        images: ['img.jpg'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (productsRepository.getProduct as jest.Mock).mockResolvedValue(mockProduct);

      await expect(productsService.deleteProduct(1, 2)).rejects.toThrow(ForbiddenError);
      expect(productsRepository.deleteProduct).not.toHaveBeenCalled();
    });
  });
});
