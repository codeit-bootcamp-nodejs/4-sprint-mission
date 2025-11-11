import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as productRepository from '../../../src/repositories/productRepository.js';
import prisma from '../../../src/config/prisma.js';

// Prisma Client를 Mock으로 설정
jest.mock('../../../src/config/prisma.js');

const mockPrisma = jest.mocked(prisma);

describe('Product Repository 유닛 테스트', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Prisma product mock 초기화
        mockPrisma.product.create = jest.fn() as any;
        mockPrisma.product.findMany = jest.fn() as any;
        mockPrisma.product.findUnique = jest.fn() as any;
        mockPrisma.product.update = jest.fn() as any;
        mockPrisma.product.delete = jest.fn() as any;
    });

    describe('findProducts', () => {
        it('모든 상품을 조회할 때 올바른 include 옵션을 사용해야 함', async () => {
            // Given
            const mockProducts = [
                {
                    id: 1,
                    name: '상품1',
                    user: { id: 1, email: 'user1@test.com', nickname: 'User1' },
                    productTags: [{ tag: { id: 1, name: 'tag1' } }],
                },
            ];

            jest.mocked(mockPrisma.product.findMany).mockResolvedValue(mockProducts as any);

            // When
            const result = await productRepository.findProducts();

            // Then
            expect(result).toEqual(mockProducts);
            expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nickname: true,
                        },
                    },
                    productTags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
            expect(mockPrisma.product.findMany).toHaveBeenCalledTimes(1);
        });

        it('커스텀 transaction 객체를 전달받으면 해당 객체를 사용해야 함', async () => {
            // Given
            const mockTx: any = {
                product: {
                    findMany: jest.fn<() => Promise<any>>().mockResolvedValue([]),
                },
            };

            // When
            await productRepository.findProducts(mockTx);

            // Then: 기본 prisma가 아닌 전달받은 tx를 사용해야 함
            expect(mockTx.product.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrisma.product.findMany).not.toHaveBeenCalled();
        });
    });

    describe('findProductById', () => {
        it('ID로 상품을 조회해야 함', async () => {
            // Given
            const mockProduct = { id: 1, name: '상품', price: 10000, userId: 1 };
            jest.mocked(mockPrisma.product.findUnique).mockResolvedValue(mockProduct as any);

            // When
            const result = await productRepository.findProductById(1);

            // Then
            expect(result).toEqual(mockProduct);
            expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(mockPrisma.product.findUnique).toHaveBeenCalledTimes(1);
        });

        it('존재하지 않는 상품을 조회하면 null을 반환해야 함', async () => {
            // Given
            jest.mocked(mockPrisma.product.findUnique).mockResolvedValue(null);

            // When
            const result = await productRepository.findProductById(999);

            // Then
            expect(result).toBeNull();
        });
    });

    describe('findProductWithTagsById', () => {
        it('태그 정보를 포함하여 상품을 조회해야 함', async () => {
            // Given
            const mockProduct = {
                id: 1,
                name: '상품',
                user: { id: 1, email: 'test@test.com', nickname: 'Test' },
                productTags: [{ tag: { id: 1, name: 'tag1' } }, { tag: { id: 2, name: 'tag2' } }],
            };

            jest.mocked(mockPrisma.product.findUnique).mockResolvedValue(mockProduct as any);

            // When
            const result = await productRepository.findProductWithTagsById(1);

            // Then
            expect(result).toEqual(mockProduct);
            expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nickname: true,
                        },
                    },
                    productTags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
        });
    });

    describe('findProductsByUserId', () => {
        it('특정 사용자의 상품만 조회해야 함', async () => {
            // Given
            const userId = 1;
            const mockProducts = [
                { id: 1, name: '상품1', userId: 1 },
                { id: 2, name: '상품2', userId: 1 },
            ];

            jest.mocked(mockPrisma.product.findMany).mockResolvedValue(mockProducts as any);

            // When
            const result = await productRepository.findProductsByUserId(userId);

            // Then
            expect(result).toEqual(mockProducts);
            expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nickname: true,
                        },
                    },
                    productTags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
        });
    });

    describe('createProductWithTags', () => {
        it('태그와 함께 상품을 생성해야 함', async () => {
            // Given
            const productData = {
                name: '새 상품',
                description: '설명',
                price: 15000,
                userId: 1,
                tags: ['tag1', 'tag2'],
            };

            const mockCreatedProduct = {
                id: 1,
                ...productData,
                productTags: [{ tag: { id: 1, name: 'tag1' } }, { tag: { id: 2, name: 'tag2' } }],
            };

            jest.mocked(mockPrisma.product.create).mockResolvedValue(mockCreatedProduct as any);

            // When
            const result = await productRepository.createProductWithTags(productData);

            // Then
            expect(result).toEqual(mockCreatedProduct);
            expect(mockPrisma.product.create).toHaveBeenCalledWith({
                data: {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    userId: productData.userId,
                    productTags: {
                        create: productData.tags.map((tagName) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName },
                                    create: { name: tagName },
                                },
                            },
                        })),
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nickname: true,
                        },
                    },
                    productTags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
        });

        it('Spy를 사용하여 create 메서드 호출을 검증해야 함', async () => {
            // Given: Spy 설정
            const createSpy = jest.spyOn(mockPrisma.product, 'create');
            createSpy.mockResolvedValue({ id: 1, name: '상품' } as any);

            const productData = {
                name: '상품',
                description: '설명',
                price: 10000,
                userId: 1,
                tags: ['tag1'],
            };

            // When
            await productRepository.createProductWithTags(productData);

            // Then: Spy로 호출 검증
            expect(createSpy).toHaveBeenCalled();
            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy.mock.calls[0][0]).toHaveProperty('data');
            expect(createSpy.mock.calls[0][0].data).toHaveProperty('name', '상품');

            // Cleanup
            createSpy.mockRestore();
        });
    });

    describe('updateProductWithTags', () => {
        it('기존 태그를 삭제하고 새 태그로 업데이트해야 함', async () => {
            // Given
            const productId = 1;
            const updateData = {
                name: '수정된 상품',
                description: '수정된 설명',
                price: 20000,
                tags: ['newTag1', 'newTag2'],
            };

            const mockUpdatedProduct = {
                id: productId,
                ...updateData,
                productTags: [{ tag: { id: 3, name: 'newTag1' } }, { tag: { id: 4, name: 'newTag2' } }],
            };

            jest.mocked(mockPrisma.product.update).mockResolvedValue(mockUpdatedProduct as any);

            // When
            const result = await productRepository.updateProductWithTags(productId, updateData);

            // Then
            expect(result).toEqual(mockUpdatedProduct);
            expect(mockPrisma.product.update).toHaveBeenCalledWith({
                where: { id: productId },
                data: {
                    name: updateData.name,
                    description: updateData.description,
                    price: updateData.price,
                    productTags: {
                        deleteMany: {}, // 기존 태그 연결 삭제
                        create: updateData.tags.map((tagName) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName },
                                    create: { name: tagName },
                                },
                            },
                        })),
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nickname: true,
                        },
                    },
                    productTags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
        });

        it('Spy를 사용하여 update 메서드의 deleteMany 옵션을 검증해야 함', async () => {
            // Given: Spy 설정
            const updateSpy = jest.spyOn(mockPrisma.product, 'update');
            updateSpy.mockResolvedValue({ id: 1 } as any);

            const updateData = {
                name: '상품',
                description: '설명',
                price: 10000,
                tags: ['tag1'],
            };

            // When
            await productRepository.updateProductWithTags(1, updateData);

            // Then: deleteMany가 호출되었는지 Spy로 검증
            expect(updateSpy).toHaveBeenCalled();
            const callArgs = updateSpy.mock.calls[0][0];
            expect(callArgs.data.productTags).toHaveProperty('deleteMany');
            expect(callArgs.data.productTags?.deleteMany).toEqual({});

            // Cleanup
            updateSpy.mockRestore();
        });
    });

    describe('updateProduct', () => {
        it('상품 정보를 업데이트해야 함', async () => {
            // Given
            const updateData = {
                name: '수정된 상품',
                description: '수정된 설명',
                price: 20000,
                tags: [],
            };

            const mockUpdatedProduct = { id: 1, ...updateData };
            jest.mocked(mockPrisma.product.update).mockResolvedValue(mockUpdatedProduct as any);

            // When
            const result = await productRepository.updateProduct(1, updateData);

            // Then
            expect(result).toEqual(mockUpdatedProduct);
            expect(mockPrisma.product.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateData,
            });
        });
    });

    describe('deleteProduct', () => {
        it('상품을 삭제해야 함', async () => {
            // Given
            const mockDeletedProduct = { id: 1, name: '삭제된 상품' };
            jest.mocked(mockPrisma.product.delete).mockResolvedValue(mockDeletedProduct as any);

            // When
            const result = await productRepository.deleteProduct(1);

            // Then
            expect(result).toEqual(mockDeletedProduct);
            expect(mockPrisma.product.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('Spy를 사용하여 delete 메서드 호출을 검증해야 함', async () => {
            // Given: Spy 설정
            const deleteSpy = jest.spyOn(mockPrisma.product, 'delete');
            deleteSpy.mockResolvedValue({ id: 1 } as any);

            // When
            await productRepository.deleteProduct(1);

            // Then: Spy로 검증
            expect(deleteSpy).toHaveBeenCalled();
            expect(deleteSpy).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(deleteSpy).toHaveBeenCalledTimes(1);

            // Cleanup
            deleteSpy.mockRestore();
        });

        it('transaction 객체가 전달되면 해당 객체의 delete를 호출해야 함', async () => {
            // Given
            const mockTx: any = {
                product: {
                    delete: jest.fn<() => Promise<any>>().mockResolvedValue({ id: 1 }),
                },
            };

            // When
            await productRepository.deleteProduct(1, mockTx);

            // Then: tx.product.delete가 호출되어야 함
            expect(mockTx.product.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(mockPrisma.product.delete).not.toHaveBeenCalled();
        });
    });

    describe('createProduct', () => {
        it('기본 상품 데이터로 상품을 생성해야 함', async () => {
            // Given
            const productData = {
                name: '상품',
                description: '설명',
                price: 10000,
                userId: 1,
                tags: [],
            };

            const mockCreatedProduct = { id: 1, ...productData };
            jest.mocked(mockPrisma.product.create).mockResolvedValue(mockCreatedProduct as any);

            // When
            const result = await productRepository.createProduct(productData);

            // Then
            expect(result).toEqual(mockCreatedProduct);
            expect(mockPrisma.product.create).toHaveBeenCalledWith({
                data: productData,
            });
        });
    });
});
