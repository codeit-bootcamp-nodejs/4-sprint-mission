// src/__tests__/unit/product_service.test.ts
import { prismaMock } from '../utils/prisma_mock';
import ProductService from '../../services/product_service';
import { Prisma } from '../../generated';

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('모든 상품을 반환해야 함', async () => {
      const mockProducts = [
        {
          id: 1,
          title: '상품1',
          description: '설명1',
          price: new Prisma.Decimal(10000),
          tags: [],
          imageUrl: null,
          ownerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { likes: 5 },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts as any);

      const products = await ProductService.getProducts();

      expect(products).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('ID로 상품을 조회해야 함', async () => {
      const mockProduct = {
        id: 1,
        title: '테스트 상품',
        description: '테스트 설명',
        price: new Prisma.Decimal(10000),
        tags: [],
        imageUrl: null,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: { id: 1, nickname: '판매자', email: 'seller@test.com' },
        _count: { likes: 3 },
      };

      prismaMock.product.findUnique.mockResolvedValue(mockProduct as any);

      const product = await ProductService.getProductById(1);

      expect(product).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('새 상품을 생성해야 함', async () => {
      const productData = {
        title: '새 상품',
        description: '새 설명',
        price: 15000,
        ownerId: 1,
        tags: ['태그1'],
        imageUrl: 'image.jpg',
      };

      const mockCreatedProduct = {
        id: 1,
        ...productData,
        price: new Prisma.Decimal(15000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.create.mockResolvedValue(mockCreatedProduct as any);

      const product = await ProductService.createProduct(productData);

      expect(product.title).toBe(productData.title);
      expect(prismaMock.product.create).toHaveBeenCalledTimes(1);
    });
  });
});