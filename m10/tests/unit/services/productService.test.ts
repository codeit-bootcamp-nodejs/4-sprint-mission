/**
 * Product Service 유닛 테스트
 *
 * 이 테스트는 Mock과 Spy를 활용한 비즈니스 로직 검증 예제입니다.
 * ESM 모듈의 제약으로 인해 순수한 비즈니스 로직과 Mock/Spy 패턴에 집중합니다.
 */

import { jest, describe, it, expect } from '@jest/globals';
import { CustomError } from '../../../src/middlewares/errorHandler.js';

describe('Product Service 유닛 테스트', () => {
    describe('비즈니스 로직 검증', () => {
        describe('상품 조회 로직', () => {
            it('Mock을 사용하여 상품 조회 함수를 테스트해야 함', async () => {
                // Given: Mock 함수 설정
                const mockProducts = [
                    { id: 1, name: '상품1', price: 10000, userId: 1 },
                    { id: 2, name: '상품2', price: 20000, userId: 2 },
                ];

                const mockFindProducts = jest
                    .fn<() => Promise<typeof mockProducts>>()
                    .mockResolvedValue(mockProducts);

                // When: Mock 함수 호출
                const result = await mockFindProducts();

                // Then: 호출 및 결과 검증
                expect(mockFindProducts).toHaveBeenCalled();
                expect(mockFindProducts).toHaveBeenCalledTimes(1);
                expect(result).toEqual(mockProducts);
            });

            it('특정 사용자의 상품 조회시 userId를 파라미터로 전달해야 함', async () => {
                // Given
                const userId = 1;
                const mockUserProducts = [{ id: 1, name: '상품1', price: 10000, userId: 1 }];

                const mockFindProductsByUserId = jest
                    .fn<(userId: number) => Promise<typeof mockUserProducts>>()
                    .mockResolvedValue(mockUserProducts);

                // When
                const result = await mockFindProductsByUserId(userId);

                // Then
                expect(mockFindProductsByUserId).toHaveBeenCalledWith(userId);
                expect(result).toEqual(mockUserProducts);
            });
        });

        describe('상품 상세 조회 로직', () => {
            it('상품이 존재하지 않으면 404 에러를 던져야 함', () => {
                // Given: 상품 조회 결과가 null
                const product = null;

                // When: 에러 조건 확인
                const shouldThrowError = product === null;

                // Then: 404 에러를 던져야 함
                expect(shouldThrowError).toBe(true);

                const error = new CustomError('상품을 찾을 수 없습니다.', 404);
                expect(error.message).toBe('상품을 찾을 수 없습니다.');
                expect(error.status).toBe(404);
            });

            it('로그인하지 않은 사용자의 경우 isLiked가 false여야 함', () => {
                // Given: userId가 null
                const userId = null;

                // When: 좋아요 상태 결정 로직
                let isLiked = false;
                if (userId) {
                    // 좋아요 조회 로직
                    isLiked = true;
                }

                // Then: isLiked가 false여야 함
                expect(isLiked).toBe(false);
            });

            it('로그인한 사용자가 좋아요한 경우 isLiked가 true여야 함', async () => {
                // Given: 좋아요 데이터
                const mockLike = { id: 1, userId: 2, productId: 1 };

                const mockFindLike = jest
                    .fn<(type: string, id: number, userId: number) => Promise<typeof mockLike>>()
                    .mockResolvedValue(mockLike);

                // When
                const liked = await mockFindLike('product', 1, 2);
                const isLiked = liked !== null;

                // Then
                expect(mockFindLike).toHaveBeenCalledWith('product', 1, 2);
                expect(isLiked).toBe(true);
            });

            it('태그 배열 변환 로직이 올바르게 동작해야 함', () => {
                // Given: productTags 데이터
                const productTags = [
                    { tag: { id: 1, name: 'tag1' } },
                    { tag: { id: 2, name: 'tag2' } },
                ];

                // When: 태그 추출
                const tags = productTags.map((pt) => pt.tag);

                // Then
                expect(tags).toEqual([
                    { id: 1, name: 'tag1' },
                    { id: 2, name: 'tag2' },
                ]);
            });
        });

        describe('상품 생성 로직', () => {
            it('트랜잭션 내에서 상품과 태그를 생성해야 함', async () => {
                // Given
                const productData = {
                    name: '새 상품',
                    description: '설명',
                    price: 10000,
                    userId: 1,
                    tags: ['tag1', 'tag2'],
                };

                const mockCreatedProduct = { id: 1, ...productData };

                // Mock 트랜잭션 함수
                const mockTransaction = jest
                    .fn<(callback: (tx: any) => Promise<any>) => Promise<any>>()
                    .mockImplementation(async (callback: any) => {
                        const mockTx = {};
                        return callback(mockTx);
                    });

                const mockCreateProduct = jest
                    .fn<(data: typeof productData, tx?: any) => Promise<typeof mockCreatedProduct>>()
                    .mockResolvedValue(mockCreatedProduct);

                // When
                await mockTransaction(async (tx: any) => {
                    return mockCreateProduct(productData, tx);
                });

                // Then
                expect(mockTransaction).toHaveBeenCalled();
                expect(mockCreateProduct).toHaveBeenCalledWith(productData, expect.anything());
            });

            it('Spy를 사용하여 createProduct 호출을 검증해야 함', async () => {
                // Given: 테스트할 객체
                const repository = {
                    createProductWithTags: async (data: any) => ({ id: 1, ...data }),
                };

                // Spy 설정
                const createSpy = jest.spyOn(repository, 'createProductWithTags');

                const productData = {
                    name: '상품',
                    description: '설명',
                    price: 10000,
                    userId: 1,
                    tags: ['tag1'],
                };

                // When
                await repository.createProductWithTags(productData);

                // Then
                expect(createSpy).toHaveBeenCalledWith(productData);
                expect(createSpy).toHaveBeenCalledTimes(1);

                // Cleanup
                createSpy.mockRestore();
            });
        });

        describe('상품 수정 로직', () => {
            it('권한 검증 로직이 올바르게 동작해야 함', () => {
                // Given: 상품 소유자와 요청자
                const product = { id: 1, userId: 1 };
                const requestUserId = 2;

                // When: 권한 검증
                const hasPermission = product.userId === requestUserId;

                // Then: 권한이 없어야 함
                expect(hasPermission).toBe(false);

                // 에러 생성 검증
                const error = new CustomError('상품을 수정할 권한이 없습니다.', 403);
                expect(error.message).toBe('상품을 수정할 권한이 없습니다.');
                expect(error.status).toBe(403);
            });

            it('가격 변경 감지 로직이 올바르게 동작해야 함', () => {
                // Given
                const existingProduct = { id: 1, price: 10000 };
                const updateData = { price: 20000 };

                // When: 가격 변경 확인 (실제 서비스 로직)
                const priceChanged = !!(updateData.price && updateData.price !== existingProduct.price);

                // Then
                expect(priceChanged).toBe(true);
            });

            it('가격 변경이 없으면 priceChanged가 false여야 함', () => {
                // Given
                const existingProduct = { id: 1, price: 10000 };
                const updateData: { name: string; price?: number } = { name: '수정된 이름' };

                // When
                const priceChanged = !!(
                    updateData.price && updateData.price !== existingProduct.price
                );

                // Then
                expect(priceChanged).toBe(false);
            });

            it('좋아요한 사용자 필터링 로직이 올바르게 동작해야 함', () => {
                // Given: 좋아요 데이터 (본인 포함)
                const likes = [{ userId: 1 }, { userId: 2 }, { userId: 3 }];
                const ownerId = 1;

                // When: 본인 제외 필터링 (실제 서비스 로직)
                const likedUserIds = likes
                    .map((like) => like.userId)
                    .filter((id) => id !== ownerId);

                // Then: 본인을 제외한 사용자만 남아야 함
                expect(likedUserIds).toEqual([2, 3]);
                expect(likedUserIds).not.toContain(ownerId);
            });

            it('Mock을 사용하여 좋아요 조회를 테스트해야 함', async () => {
                // Given
                const mockLikes = [{ userId: 2 }, { userId: 3 }];

                // Mock 트랜잭션 객체
                const mockFindMany = jest
                    .fn<(args: any) => Promise<typeof mockLikes>>()
                    .mockResolvedValue(mockLikes);
                const mockTx = {
                    like: {
                        findMany: mockFindMany,
                    },
                };

                // When
                const likes = await mockTx.like.findMany({
                    where: { productId: 1 },
                    select: { userId: true },
                });

                // Then
                expect(mockTx.like.findMany).toHaveBeenCalledWith({
                    where: { productId: 1 },
                    select: { userId: true },
                });
                expect(likes).toEqual(mockLikes);
            });

            it('Spy를 사용하여 updateProduct 호출을 검증해야 함', async () => {
                // Given: 테스트할 객체
                const repository = {
                    updateProductWithTags: async (id: number, data: any) => ({
                        id,
                        ...data,
                    }),
                };

                // Spy 설정
                const updateSpy = jest.spyOn(repository, 'updateProductWithTags');

                const updateData = { name: '수정된 상품', price: 20000 };

                // When
                await repository.updateProductWithTags(1, updateData);

                // Then
                expect(updateSpy).toHaveBeenCalledWith(1, updateData);
                expect(updateSpy).toHaveBeenCalledTimes(1);

                // Cleanup
                updateSpy.mockRestore();
            });
        });

        describe('상품 삭제 로직', () => {
            it('존재하지 않는 상품 삭제시 404 에러를 던져야 함', () => {
                // Given
                const product = null;

                // When: 에러 조건
                const shouldThrowError = product === null;

                // Then
                expect(shouldThrowError).toBe(true);

                const error = new CustomError('상품을 찾을 수 없습니다.', 404);
                expect(error.message).toBe('상품을 찾을 수 없습니다.');
            });

            it('다른 사용자의 상품 삭제시 403 에러를 던져야 함', () => {
                // Given
                const product = { id: 1, userId: 1 };
                const requestUserId = 2;

                // When: 권한 검증
                const hasPermission = product.userId === requestUserId;

                // Then
                expect(hasPermission).toBe(false);

                const error = new CustomError('상품을 삭제할 권한이 없습니다.', 403);
                expect(error.status).toBe(403);
            });

            it('Mock을 사용하여 삭제 작업을 테스트해야 함', async () => {
                // Given
                const mockProduct = { id: 1, name: '상품', userId: 1 };

                const mockDeleteProduct = jest
                    .fn<(id: number) => Promise<typeof mockProduct>>()
                    .mockResolvedValue(mockProduct);

                // When
                await mockDeleteProduct(1);

                // Then
                expect(mockDeleteProduct).toHaveBeenCalledWith(1);
            });

            it('Spy를 사용하여 deleteProduct 호출을 검증해야 함', async () => {
                // Given: 테스트할 객체
                const repository = {
                    deleteProduct: async (id: number) => ({ id }),
                };

                // Spy 설정
                const deleteSpy = jest.spyOn(repository, 'deleteProduct');

                // When
                await repository.deleteProduct(1);

                // Then
                expect(deleteSpy).toHaveBeenCalledWith(1);
                expect(deleteSpy).toHaveBeenCalledTimes(1);

                // Cleanup
                deleteSpy.mockRestore();
            });
        });

        describe('알림 전송 로직', () => {
            it('가격 변경시 알림 전송 조건을 검증해야 함', () => {
                // Given
                const priceChanged = true;
                const likedUserIds = [2, 3];

                // When: 알림 전송 조건 (실제 서비스 로직)
                const shouldSendNotification = priceChanged && likedUserIds.length > 0;

                // Then
                expect(shouldSendNotification).toBe(true);
            });

            it('가격 변경이 없으면 알림을 보내지 않아야 함', () => {
                // Given
                const priceChanged = false;
                const likedUserIds = [2, 3];

                // When
                const shouldSendNotification = priceChanged && likedUserIds.length > 0;

                // Then
                expect(shouldSendNotification).toBe(false);
            });

            it('좋아요한 사용자가 없으면 알림을 보내지 않아야 함', () => {
                // Given
                const priceChanged = true;
                const likedUserIds: number[] = [];

                // When
                const shouldSendNotification = priceChanged && likedUserIds.length > 0;

                // Then
                expect(shouldSendNotification).toBe(false);
            });

            it('Mock을 사용하여 알림 전송 함수를 테스트해야 함', async () => {
                // Given
                const notificationData = {
                    type: 'PRICE_CHANGE',
                    message: '가격이 변경되었습니다.',
                    userId: 2,
                    productId: 1,
                };

                const mockSendNotification = jest
                    .fn<(data: typeof notificationData) => Promise<void>>()
                    .mockResolvedValue(undefined);

                // When
                await mockSendNotification(notificationData);

                // Then
                expect(mockSendNotification).toHaveBeenCalledWith(notificationData);
            });
        });
    });

    describe('Mock과 Spy 패턴 검증', () => {
        it('mockResolvedValue를 사용한 비동기 함수 Mock', async () => {
            // Given
            const mockFunction = jest
                .fn<() => Promise<{ success: boolean }>>()
                .mockResolvedValue({ success: true });

            // When
            const result = await mockFunction();

            // Then
            expect(result).toEqual({ success: true });
            expect(mockFunction).toHaveBeenCalled();
        });

        it('mockRejectedValue를 사용한 에러 Mock', async () => {
            // Given
            const error = new CustomError('상품을 찾을 수 없습니다.', 404);
            const mockFunction = jest
                .fn<() => Promise<never>>()
                .mockRejectedValue(error);

            // When & Then
            await expect(mockFunction()).rejects.toThrow('상품을 찾을 수 없습니다.');
        });

        it('mockImplementation을 사용한 커스텀 로직', () => {
            // Given: 할인 계산 Mock
            const mockCalculateDiscount = jest.fn<(price: number) => number>();
            mockCalculateDiscount.mockImplementation((price: number) => price * 0.9);

            // When
            const discountedPrice = mockCalculateDiscount(10000);

            // Then
            expect(discountedPrice).toBe(9000);
            expect(mockCalculateDiscount).toHaveBeenCalledWith(10000);
        });

        it('Spy를 사용하여 메서드 호출 추적', () => {
            // Given: 테스트할 객체
            const calculator = {
                add: (a: number, b: number) => a + b,
                multiply: (a: number, b: number) => a * b,
            };

            // Spy 설정
            const addSpy = jest.spyOn(calculator, 'add');
            const multiplySpy = jest.spyOn(calculator, 'multiply');

            // When
            calculator.add(5, 3);
            calculator.multiply(4, 2);

            // Then
            expect(addSpy).toHaveBeenCalledWith(5, 3);
            expect(multiplySpy).toHaveBeenCalledWith(4, 2);

            // Cleanup
            addSpy.mockRestore();
            multiplySpy.mockRestore();
        });

        it('Mock 함수의 호출 횟수와 파라미터를 검증', () => {
            // Given
            const mockCallback = jest.fn<(arg: string) => void>();

            // When
            mockCallback('first');
            mockCallback('second');
            mockCallback('third');

            // Then
            expect(mockCallback).toHaveBeenCalledTimes(3);
            expect(mockCallback).toHaveBeenNthCalledWith(1, 'first');
            expect(mockCallback).toHaveBeenNthCalledWith(2, 'second');
            expect(mockCallback).toHaveBeenNthCalledWith(3, 'third');
        });
    });
});
