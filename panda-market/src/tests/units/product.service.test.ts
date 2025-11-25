import { NotifyType, PrismaClient } from '@prisma/client';
import { ProductRepository } from '@/repositories/products.repository.js';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { TagRepository } from '@/repositories/tags.repository.js';
import { ProductImageRepository } from '@/repositories/product-images.repository.js';
import { ProductLikeRepository } from '@/repositories/product-likes.repository.js';
import { NotificationRepository } from '@/repositories/notification.repository.js';
import { Server } from 'socket.io';
import { ProductService } from '@/services/product.service.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/lib/errors.js';
import { jest } from '@jest/globals';
import {
  baseUpdateInput,
  createData,
  createInput,
  createParams,
  createResult,
  likedData,
  likedListData,
  likedListData2,
  likedListResult,
  likedResult,
  MOCK_TIME,
  unlikedData,
  unlikedListData,
  unlikedListResult,
  unlikedListResult2,
  unlikedResult,
  updateData,
  updateResult,
  updateTagData,
} from '@/tests/fixtures/product.fixtures.js';
// mockDeep이 타입세이프하게 모킹해주는거라고 함
// (정확히는 해당 객체의 타입만 확인해서 프록시 객체를 생성해주는 모킹방식)

// 기존 jest.mock은 private를 추론할 수 없음
// 근데 중첩된 의존성을 거슬러 올라가도 prisma 이런 애들을 제대로 인정을 안해줌 -> 왜였더라?
// 그리고 기능별 개별 mock 방식도 불가 ( 런타임에서 의존성 없어서 오류남 )
// 반드시 객체와 의존성을 mock 정의하고 인스턴스로 생성해야함
// mockDeep, DeepMockProxy는 모킹하고자 하는 객체의 타입만 확인해서 프록시 모킹 객체를 만들어준다.
// 이 과정에서 private, readonly, constructor 같은 실제 구현에 필요한 요소들은 무시된다.

describe('ProductService', () => {
  let mockPrisma: DeepMockProxy<PrismaClient>;
  let mockProductRepo: DeepMockProxy<ProductRepository>;
  let mockTagRepo: DeepMockProxy<TagRepository>;
  let mockProductImgRepo: DeepMockProxy<ProductImageRepository>;
  let mockProductLikeRepo: DeepMockProxy<ProductLikeRepository>;
  let mockNotificationRepo: DeepMockProxy<NotificationRepository>;
  let mockIo: DeepMockProxy<Server>;
  let mockProductService: ProductService;

  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    mockProductRepo = mockDeep<ProductRepository>();
    mockTagRepo = mockDeep<TagRepository>();
    mockProductImgRepo = mockDeep<ProductImageRepository>();
    mockProductLikeRepo = mockDeep<ProductLikeRepository>();
    mockNotificationRepo = mockDeep<NotificationRepository>();
    mockIo = mockDeep<Server>();

    mockProductService = new ProductService(
      mockProductRepo,
      mockPrisma,
      mockTagRepo,
      mockProductImgRepo,
      mockProductLikeRepo,
      mockNotificationRepo,
      mockIo,
    );
  });
  describe('단일 상품 조회', () => {
    it('좋아요를 누르지 않은 상품은 isLike: false가 포함되어야 한다.', async () => {
      // given
      mockProductRepo.findById.mockResolvedValue(unlikedData);
      // when
      const result = await mockProductService.getProduct({
        productId: 1,
        userId: 1,
      });
      // then
      expect(result).toEqual(unlikedResult);
    });
    it('좋아요를 누른 상품은 isLike: true가 포함되어야 한다.', async () => {
      // given
      mockProductRepo.findById.mockResolvedValue(likedData);
      // when
      const result = await mockProductService.getProduct({
        productId: 1,
        userId: 1,
      });
      // then
      expect(result).toEqual(likedResult);
    });
    it('로그인 하지 않은 유저가 요청한 경우 isLike: false가 포함된 상품을 반환해야 한다.', async () => {
      // given
      mockProductRepo.findById.mockResolvedValue(likedData);
      // when
      const result = await mockProductService.getProduct({
        productId: 1,
        userId: undefined,
      });
      // then
      expect(result).toEqual(unlikedResult);
    });
    it('존재하지 않는 상품을 조회할 경우 404 에러를 반환해야한다.', async () => {
      mockProductRepo.findById.mockResolvedValue(null);
      await expect(
        mockProductService.getProduct({ productId: 999, userId: 1 }),
      ).rejects.toThrow(NotFoundError);

      expect(mockProductRepo.findById).toHaveBeenCalledWith({
        productId: 999,
        userId: 1,
      });
    });
  });
  describe('상품 목록 조회', () => {
    it('상품 목록에서 좋아요를 누른 상품은 isLike: true가 포함되어야 한다.', async () => {
      // given
      mockProductRepo.findMany.mockResolvedValue([likedListData]);
      // when
      const result = await mockProductService.getProductList({
        keyword: '',
        page: 1,
        pageSize: 10,
        orderBy: '',
        userId: 2,
      });
      // then
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(likedListResult);
    });
    it('상품 목록에서 좋아요를 누르지 않은 상품은 isLike: false가 포함되어야 한다.', async () => {
      // given
      mockProductRepo.findMany.mockResolvedValue([unlikedListData]);
      // when
      const result = await mockProductService.getProductList({
        keyword: '',
        page: 1,
        pageSize: 10,
        orderBy: '',
        userId: 2,
      });
      // then
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(unlikedListResult);
    });
    it('로그인 하지 않은 유저가 요청한 경우 모든 상품은 isLike: false가 포함되어야한다.', async () => {
      // given
      mockProductRepo.findMany.mockResolvedValue([
        unlikedListData,
        likedListData2,
      ]);
      // when
      const result = await mockProductService.getProductList({
        keyword: '',
        page: 1,
        pageSize: 10,
        orderBy: '',
      });
      // then
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(unlikedListResult);
      expect(result[1]).toEqual(unlikedListResult2);
    });
    it('상품목록은 최신순 조회가 가능하다.', async () => {
      // given
      const date = new Date('2025-01-02T00:00:00.000Z');
      mockProductRepo.findMany.mockResolvedValue([
        unlikedListData,
        {
          ...likedListData2,
          createdAt: date,
        },
      ]);
      // when
      const result = await mockProductService.getProductList({
        keyword: '',
        page: 1,
        pageSize: 10,
        orderBy: 'recent',
      });
      // then
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(mockProductRepo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: 'recent',
        }),
      );
    });
    it('상품목록은 좋아요순 조회가 가능하다.', async () => {
      // given
      mockProductRepo.findMany.mockResolvedValue([
        likedListData2,
        unlikedListData,
      ]);
      // when
      const result = await mockProductService.getProductList({
        keyword: '',
        page: 1,
        pageSize: 10,
        orderBy: 'like',
      });
      // then
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(mockProductRepo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: 'like',
        }),
      );
    });
  });
  describe('상품 생성', () => {
    it('상품 생성 성공', async () => {
      // given
      mockProductRepo.create.mockResolvedValue(createData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockTagRepo.incrementCounts.mockResolvedValue({
        count: 1,
      });
      mockProductImgRepo.createMany.mockResolvedValue({
        count: 1,
      });
      mockProductRepo.findById.mockResolvedValue(createResult);
      // when
      const result = await mockProductService.postProduct({
        userId: 1,
        data: {
          ...createParams,
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
          ],
        },
      });
      // then
      expect(result).toEqual(createResult);
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockProductRepo.create).toHaveBeenCalledWith({
        createData: createInput,
        tx: mockPrisma,
      });
      expect(mockTagRepo.incrementCounts).toHaveBeenCalledWith({
        tags: ['test'],
        tx: mockPrisma,
      });
      expect(mockProductImgRepo.createMany).toHaveBeenCalledWith({
        imageData: [
          {
            publicId: 'test', // extractPublicIdFromCloudinaryUrl 결과
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
            productId: createData.id,
          },
        ],
        tx: mockPrisma,
      });
    });
    it('tag 증가가 실패하면 트랜잭션에 의해 롤백되어야 한다.', async () => {
      // given
      mockProductRepo.create.mockResolvedValue(createData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockTagRepo.incrementCounts.mockRejectedValue(
        new BadRequestError('tag 에러'),
      );
      mockProductImgRepo.createMany.mockResolvedValue({
        count: 1,
      });
      mockProductRepo.findById.mockResolvedValue({
        ...createResult,
        images: [
          {
            id: 1,
            publicId: 'test',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
          },
        ],
        likes: [],
      });
      // when
      // then
      await expect(
        mockProductService.postProduct({
          userId: 1,
          data: {
            ...createParams,
            imageUrls: [
              'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
            ],
          },
        }),
      ).rejects.toThrow('tag 에러');
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockProductRepo.create).toHaveBeenCalledWith({
        createData: createInput,
        tx: mockPrisma,
      });
    });
    it('이미지 생성이 실패하면 트랜잭션에 의해 롤백되어야 한다.', async () => {
      // given
      mockProductRepo.create.mockResolvedValue(createData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockTagRepo.incrementCounts.mockResolvedValue({
        count: 1,
      });
      mockProductImgRepo.createMany.mockRejectedValue(
        new BadRequestError('image 에러'),
      );
      mockProductRepo.findById.mockResolvedValue({
        ...createResult,
        images: [
          {
            id: 1,
            publicId: 'test',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
          },
        ],
        likes: [],
      });
      // when
      // then
      await expect(
        mockProductService.postProduct({
          userId: 1,
          data: {
            ...createParams,
            imageUrls: [
              'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
            ],
          },
        }),
      ).rejects.toThrow('image 에러');
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockProductRepo.create).toHaveBeenCalledWith({
        createData: createInput,
        tx: mockPrisma,
      });
    });
    it('상품 생성이 실패하면 트랜잭션에 의해 롤백되어야 한다.', async () => {
      // given
      mockProductRepo.create.mockRejectedValue(
        new BadRequestError('product 에러'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockTagRepo.incrementCounts.mockResolvedValue({
        count: 1,
      });
      mockProductImgRepo.createMany.mockResolvedValue({
        count: 1,
      });
      mockProductRepo.findById.mockResolvedValue({
        ...createResult,
        images: [
          {
            id: 1,
            publicId: 'test',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
          },
        ],
        likes: [],
      });
      // when
      // then
      await expect(
        mockProductService.postProduct({
          userId: 1,
          data: {
            ...createParams,
            imageUrls: [
              'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test.png',
            ],
          },
        }),
      ).rejects.toThrow('product 에러');
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockProductRepo.create).toHaveBeenCalledWith({
        createData: createInput,
        tx: mockPrisma,
      });
    });
  });
  describe('상품 수정', () => {
    it('상품의 일반 필드만 수정할 경우 트랜잭션 없이 업데이트 된다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue(updateData);
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test1',
          description: '일반 필드 수정 테스트',
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith(baseUpdateInput);
      expect(result).toEqual({
        ...updateResult,
        name: 'test1',
        description: '일반 필드 수정 테스트',
      });
    });
    it('새로운 태그가 추가되면 해당 태그 카운트가 증가해야한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue(updateTagData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockTagRepo.findMany.mockResolvedValue(['test']);
      mockTagRepo.incrementCounts.mockResolvedValue({ count: 1 });
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test1',
          description: '태그 수정 테스트1',
          price: 1,
          tags: ['test', 'test2'],
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test1',
          description: '태그 수정 테스트1',
          price: 1,
          tags: {
            connectOrCreate: [
              {
                where: { name: 'test2' },
                create: { name: 'test2' },
              },
            ],
            disconnect: [],
          },
        },
        tx: mockPrisma,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test1',
        description: '태그 수정 테스트1',
        tags: [
          {
            id: 1,
            name: 'test',
            productCount: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
          {
            id: 2,
            name: 'test2',
            productCount: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
      expect(mockTagRepo.incrementCounts).toHaveBeenCalledWith({
        tags: ['test2'],
        tx: mockPrisma,
      });
      expect(mockTagRepo.decrementCounts).not.toHaveBeenCalled();
    });
    it('기존 태그가 삭제되면 해당 태그 카운트가 감소해야한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateTagData,
        name: 'test2',
        description: '태그 수정 테스트2',
        price: 1,
        tags: [
          {
            id: 1,
            name: 'test',
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
            productCount: 1,
          },
        ],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockTagRepo.findMany.mockResolvedValue(['test', 'test2']);
      mockTagRepo.decrementCounts.mockResolvedValue({ count: 0 });
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test2',
          description: '태그 수정 테스트2',
          price: 1,
          tags: ['test'],
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test2',
          description: '태그 수정 테스트2',
          price: 1,
          tags: {
            connectOrCreate: [],
            disconnect: [{ name: 'test2' }],
          },
        },
        tx: mockPrisma,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test2',
        description: '태그 수정 테스트2',
        tags: [
          {
            id: 1,
            name: 'test',
            productCount: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
      expect(mockTagRepo.decrementCounts).toHaveBeenCalledWith({
        tags: ['test2'],
        tx: mockPrisma,
      });
      expect(mockTagRepo.incrementCounts).not.toHaveBeenCalled();
    });
    it('새로운 태그가 추가되고 기존 태그가 삭제되면 태그 카운트가 적절하게 증감해야한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test3',
        description: '태그 수정 테스트3',
        tags: [
          {
            id: 1,
            name: 'test',
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
            productCount: 1,
          },
          {
            id: 3,
            name: 'test3',
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
            productCount: 1,
          },
        ],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockTagRepo.findMany.mockResolvedValue(['test', 'test2']);
      mockTagRepo.decrementCounts.mockResolvedValue({ count: 0 });
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test3',
          description: '태그 수정 테스트3',
          price: 1,
          tags: ['test', 'test3'],
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test3',
          description: '태그 수정 테스트3',
          price: 1,
          tags: {
            connectOrCreate: [
              { create: { name: 'test3' }, where: { name: 'test3' } },
            ],
            disconnect: [{ name: 'test2' }],
          },
        },
        tx: mockPrisma,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test3',
        description: '태그 수정 테스트3',
        tags: [
          {
            id: 1,
            name: 'test',
            productCount: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
          {
            id: 3,
            name: 'test3',
            productCount: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
      expect(mockTagRepo.decrementCounts).toHaveBeenCalledWith({
        tags: ['test2'],
        tx: mockPrisma,
      });
      expect(mockTagRepo.incrementCounts).toHaveBeenCalledWith({
        tags: ['test3'],
        tx: mockPrisma,
      });
    });
    it('이미지를 추가한 경우 새로 추가된 이미지 url이 포함된 상품을 반환해야 한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test1',
        description: '이미지 수정 테스트1',
        images: [
          {
            id: 1,
            publicId: 'test1',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
          },
          {
            id: 2,
            publicId: 'test2',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          },
        ],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockProductImgRepo.findMany.mockResolvedValue([
        {
          publicId: 'test1',
          url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
        },
      ]);
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test1',
          description: '이미지 수정 테스트1',
          price: 1,
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          ],
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test1',
          description: '이미지 수정 테스트1',
          price: 1,
          images: {
            deleteMany: [],
            create: [
              {
                url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
                publicId: 'test2',
              },
            ],
          },
        },
        tx: mockPrisma,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test1',
        description: '이미지 수정 테스트1',
        images: [
          {
            id: 1,
            publicId: 'test1',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
          },
          {
            id: 2,
            publicId: 'test2',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          },
        ],
      });
    });
    it('이미지를 삭제한 경우 해당 이미지 url이 삭제된 상품을 반환해야 한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test2',
        description: '이미지 수정 테스트2',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockProductImgRepo.findMany.mockResolvedValue([
        {
          publicId: 'test1',
          url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
        },
      ]);
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test2',
          description: '이미지 수정 테스트2',
          price: 1,
          imageUrls: [],
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test2',
          description: '이미지 수정 테스트2',
          price: 1,
          images: {
            deleteMany: [
              {
                publicId: 'test1',
              },
            ],
            create: [],
          },
        },
        tx: mockPrisma,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test2',
        description: '이미지 수정 테스트2',
      });
    });
    it('이미지 추가, 삭제된 경우 url이 추가, 삭제된 상품을 반환해야 한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test3',
        description: '이미지 수정 테스트3',
        images: [
          {
            id: 2,
            publicId: 'test2',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          },
        ],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockProductImgRepo.findMany.mockResolvedValue([
        {
          publicId: 'test1',
          url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
        },
      ]);
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test3',
          description: '이미지 수정 테스트3',
          price: 1,
          imageUrls: [
            'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          ],
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test3',
          description: '이미지 수정 테스트3',
          price: 1,
          images: {
            deleteMany: [
              {
                publicId: 'test1',
              },
            ],
            create: [
              {
                url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
                publicId: 'test2',
              },
            ],
          },
        },
        tx: mockPrisma,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test3',
        description: '이미지 수정 테스트3',
        images: [
          {
            id: 2,
            publicId: 'test2',
            url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test2.png',
          },
        ],
      });
    });
    it('상품의 가격이 변경된 경우 좋아요 누른 사용자에게 알림이 전송되어야 한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test1',
        description: '가격 수정 테스트1',
        price: 2,
        likes: [
          {
            userId: 2,
            productId: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
      mockProductRepo.findPriceById.mockResolvedValue({ price: 1 });
      mockProductLikeRepo.findManyByProductId.mockResolvedValue([
        { userId: 2 },
      ]);
      mockNotificationRepo.createMany.mockResolvedValue({
        count: 1,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      const emitMock = jest.fn();
      (mockIo.to as jest.Mock).mockReturnValue({
        emit: emitMock,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockIo as any).emitMock = emitMock;
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test1',
          description: '가격 수정 테스트1',
          price: 2,
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test1',
          description: '가격 수정 테스트1',
          price: 2,
        },
        tx: mockPrisma,
      });
      expect(mockNotificationRepo.createMany).toHaveBeenCalledWith({
        createData: [
          {
            recipientId: 2,
            senderId: 1,
            type: NotifyType.PRICE_UPDATE_PRODUCT,
            targetId: 1,
          },
        ],
        tx: mockPrisma,
      });
      expect(mockProductRepo.findPriceById).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      expect(mockProductLikeRepo.findManyByProductId).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      expect(mockIo.to).toHaveBeenCalledWith('user_2');
      expect(emitMock).toHaveBeenCalledWith('new_notification', {
        type: NotifyType.PRICE_UPDATE_PRODUCT,
        message: '좋아요한 상품의 가격이 변동되었습니다!',
        productId: 1,
        newPrice: 2,
      });
      expect(result).toEqual({
        ...updateResult,
        name: 'test1',
        description: '가격 수정 테스트1',
        price: 2,
        likes: [
          {
            userId: 2,
            productId: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
    });
    it('상품의 가격이 변경됐을 때 좋아요 누른 사용자가 없다면 알림이 전송되지 않아야한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test2',
        description: '가격 수정 테스트2',
        price: 2,
      });
      mockProductRepo.findPriceById.mockResolvedValue({ price: 1 });
      mockProductLikeRepo.findManyByProductId.mockResolvedValue([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      const emitMock = jest.fn();
      (mockIo.to as jest.Mock).mockReturnValue({
        emit: emitMock,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockIo as any).emitMock = emitMock;
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test2',
          description: '가격 수정 테스트2',
          price: 2,
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test2',
          description: '가격 수정 테스트2',
          price: 2,
        },
        tx: mockPrisma,
      });
      expect(mockNotificationRepo.createMany).not.toHaveBeenCalled();
      expect(mockProductRepo.findPriceById).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      expect(mockProductLikeRepo.findManyByProductId).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      // 알림 미발송 확인
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(emitMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updateResult,
        name: 'test2',
        description: '가격 수정 테스트2',
        price: 2,
      });
    });
    it('상품의 가격이 변경됐을 때 좋아요 누른 사용자가 자기 자신이면 알림이 전송되지 않아야한다.', async () => {
      // given
      mockProductRepo.update.mockResolvedValue({
        ...updateData,
        name: 'test3',
        description: '가격 수정 테스트3',
        price: 2,
        likes: [
          {
            userId: 1,
            productId: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
      mockProductRepo.findPriceById.mockResolvedValue({ price: 1 });
      mockProductLikeRepo.findManyByProductId.mockResolvedValue([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      const emitMock = jest.fn();
      (mockIo.to as jest.Mock).mockReturnValue({
        emit: emitMock,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockIo as any).emitMock = emitMock;
      // when
      const result = await mockProductService.patchProduct({
        userId: 1,
        productId: 1,
        data: {
          name: 'test3',
          description: '가격 수정 테스트3',
          price: 2,
        },
      });
      // then
      expect(mockProductRepo.update).toHaveBeenCalledWith({
        ...baseUpdateInput,
        patchData: {
          name: 'test3',
          description: '가격 수정 테스트3',
          price: 2,
        },
        tx: mockPrisma,
      });
      expect(mockNotificationRepo.createMany).not.toHaveBeenCalled();
      expect(mockProductRepo.findPriceById).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      expect(mockProductLikeRepo.findManyByProductId).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      // 알림 미발송 확인
      expect(mockIo.to).not.toHaveBeenCalled();
      expect(emitMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updateResult,
        name: 'test3',
        description: '가격 수정 테스트3',
        price: 2,
        likes: [
          {
            userId: 1,
            productId: 1,
            createdAt: MOCK_TIME,
            updatedAt: MOCK_TIME,
          },
        ],
      });
    });
    it('유저가 생성한 상품이 없는 경우 404 오류 발생', async () => {
      // given
      mockProductRepo.findOwnerById.mockResolvedValue(null);
      // when
      // then
      await expect(
        mockProductService.patchProduct({
          userId: 1,
          productId: 1,
          data: {
            name: 'test1',
            description: '수정 테스트1',
          },
        }),
      ).rejects.toThrow(new NotFoundError());
    });
    it('해당 상품이 유저가 생성한 상품이 아닌 경우 403 오류 발생', async () => {
      // given
      mockProductRepo.findOwnerById.mockResolvedValue({ userId: 999 });
      // when
      // then
      await expect(
        mockProductService.patchProduct({
          userId: 1,
          productId: 1,
          data: {
            name: 'test1',
            description: '수정 테스트1',
          },
        }),
      ).rejects.toThrow(new ForbiddenError('수정 권한이 없습니다.'));
    });
    it('수정할 데이터가 하나도 없는 경우 400 에러 발생', async () => {
      // given
      mockProductRepo.findOwnerById.mockResolvedValue({ userId: 1 });
      // when
      // then
      await expect(
        mockProductService.patchProduct({
          userId: 1,
          productId: 1,
          data: {},
        }),
      ).rejects.toThrow(new BadRequestError('수정할 상품 데이터가 없습니다.'));
    });
  });
  describe('상품 삭제', () => {
    it('상품이 삭제될 때 상품의 이미지도 삭제되고 태그 카운트도 감소한다.', async () => {
      // given
      mockProductRepo.delete.mockResolvedValue({
        id: 1,
        name: 'test1',
        description: '삭제 테스트1',
        price: 1,
        likeCount: 0,
        userId: 1,
        createdAt: MOCK_TIME,
        updatedAt: MOCK_TIME,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation(async (cb: any) =>
        cb(mockPrisma),
      );
      mockProductRepo.findOwnerById.mockResolvedValue({
        userId: 1,
      });
      mockProductImgRepo.findMany.mockResolvedValue([
        {
          publicId: 'test1',
          url: 'https://res.cloudinary.com/testtest/image/upload/v99999999/test_files/test1.png',
        },
      ]);
      mockTagRepo.findMany.mockResolvedValue(['test1']);
      mockTagRepo.decrementCounts.mockResolvedValue({ count: 0 });
      // when
      const result = await mockProductService.deleteProduct({
        userId: 1,
        productId: 1,
      });
      // then
      expect(result).toEqual({
        id: 1,
        name: 'test1',
        description: '삭제 테스트1',
        price: 1,
        likeCount: 0,
        userId: 1,
        createdAt: MOCK_TIME,
        updatedAt: MOCK_TIME,
      });
      expect(mockProductRepo.findOwnerById).toHaveBeenCalledWith({
        productId: 1,
      });
      expect(mockTagRepo.findMany).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      expect(mockTagRepo.decrementCounts).toHaveBeenCalledWith({
        tags: ['test1'],
        tx: mockPrisma,
      });
      expect(mockProductImgRepo.findMany).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
      expect(mockProductRepo.delete).toHaveBeenCalledWith({
        productId: 1,
        tx: mockPrisma,
      });
    });
    it('해당 상품이 유저가 생성한 상품이 아닌 경우 403 오류 발생', async () => {
      // given
      mockProductRepo.findOwnerById.mockResolvedValue({ userId: 999 });
      // when
      // then
      await expect(
        mockProductService.deleteProduct({
          userId: 1,
          productId: 1,
        }),
      ).rejects.toThrow(new ForbiddenError('삭제 권한이 없습니다.'));
    });
  });
});
