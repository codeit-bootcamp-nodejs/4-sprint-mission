import { ProductsService } from '../../services/products.service';
import { ProductsRepository } from '../../repositories/products.repository';
import { NotificationsService } from '../../services/notifications.service';

// 1. 단순하게 모듈 Mocking (복잡한 팩토리 함수 제거)
jest.mock('../../repositories/products.repository');
jest.mock('../../services/notifications.service');

describe('ProductsService Unit Test', () => {
  let productsService: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;
  let notificationsService: jest.Mocked<NotificationsService>;

  beforeEach(() => {
    // 2. 호출 횟수 초기화 
    jest.clearAllMocks();

    // 3. Repository 메서드를 하나하나 수동으로 정의
    productsRepository = {
      findProducts: jest.fn(),
      findProductById: jest.fn(),
      findProductByIdSimple: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      findProductLike: jest.fn(),
      createProductLike: jest.fn(),
      deleteProductLike: jest.fn(),
      findProductsByAuthorId: jest.fn(),
      findLikedProductsByUserId: jest.fn(),
      // 기본값 설정
      findProductLikesByProductId: jest.fn().mockResolvedValue([]), 
    } as unknown as jest.Mocked<ProductsRepository>;

    // Notification Mock 설정
    notificationsService = {
      createNotification: jest.fn(),
    } as unknown as jest.Mocked<NotificationsService>;

    // Service 생성 및 주입
    productsService = new ProductsService(productsRepository);
    productsService.notificationsService = notificationsService;
  });

  // getProducts 메서드 테스트
  describe('getProducts', () => {
    it('모든 상품을 성공적으로 반환해야 합니다.', async () => {
      const mockProducts = [
        { id: 1, name: 'Test Product 1', content: 'Content 1', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser1' } },
        { id: 2, name: 'Test Product 2', content: 'Content 2', price: 2000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser1' } },
      ];
      // findProducts 메서드가 mockProducts를 반환하도록 설정합니다.
      productsRepository.findProducts.mockResolvedValue(mockProducts);

      const products = await productsService.getProducts();

      // findProducts 메서드가 한 번 호출되었는지 확인합니다.
      expect(productsRepository.findProducts).toHaveBeenCalledTimes(1);
      // 반환된 상품이 mockProducts와 일치하는지 확인합니다.
      expect(products).toEqual(mockProducts);
    });
  });

  // getProductById 메서드 테스트
  describe('getProductById', () => {
    it('ID로 상품을 성공적으로 반환해야 합니다.', async () => {
      const mockProduct = { id: 1, name: 'Test Product', content: 'Content', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
      // findProductById 메서드가 mockProduct를 반환하도록 설정합니다.
      productsRepository.findProductById.mockResolvedValue(mockProduct);

      const product = await productsService.getProductById(1);

      // findProductById 메서드가 올바른 ID로 한 번 호출되었는지 확인합니다.
      expect(productsRepository.findProductById).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductById).toHaveBeenCalledWith(1);
      // 반환된 상품이 mockProduct와 일치하는지 확인합니다.
      expect(product).toEqual({ ...mockProduct, isLiked: false }); // isLiked는 서비스 로직에서 추가되므로 포함
    });

    it('상품을 찾을 수 없을 때 NotFoundError를 던져야 합니다.', async () => {
      // findProductById 메서드가 null을 반환하도록 설정합니다.
      productsRepository.findProductById.mockResolvedValue(null);

      // 에러가 발생하는지 확인합니다.
      await expect(productsService.getProductById(999)).rejects.toThrow('상품을 찾을 수 없습니다.');
      await expect(productsService.getProductById(999)).rejects.toHaveProperty('name', 'NotFoundError');
      // findProductById 메서드가 올바른 ID로 한 번 호출되었는지 확인합니다.
      expect(productsRepository.findProductById).toHaveBeenCalledTimes(2);
      expect(productsRepository.findProductById).toHaveBeenCalledWith(999);
    });

    it('사용자가 상품에 좋아요를 눌렀을 때 isLiked가 true여야 합니다.', async () => {
      const mockProduct = { id: 1, name: 'Test Product', content: 'Content', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
      const userId = 2;
      // findProductById 메서드가 mockProduct를 반환하도록 설정합니다.
      productsRepository.findProductById.mockResolvedValue(mockProduct);
      // findProductLike 메서드가 좋아요를 반환하도록 설정합니다.
      productsRepository.findProductLike.mockResolvedValue({ userId, productId: 1 });

      const product = await productsService.getProductById(1, userId);

      expect(productsRepository.findProductById).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductById).toHaveBeenCalledWith(1);
      expect(productsRepository.findProductLike).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductLike).toHaveBeenCalledWith(userId, 1);
      expect(product).toEqual({ ...mockProduct, isLiked: true });
    });

    it('사용자가 상품에 좋아요를 누르지 않았을 때 isLiked가 false여야 합니다.', async () => {
      const mockProduct = { id: 1, name: 'Test Product', content: 'Content', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
      const userId = 2;
      // findProductById 메서드가 mockProduct를 반환하도록 설정합니다.
      productsRepository.findProductById.mockResolvedValue(mockProduct);
      // findProductLike 메서드가 null을 반환하도록 설정합니다.
      productsRepository.findProductLike.mockResolvedValue(null);

      const product = await productsService.getProductById(1, userId);

      expect(productsRepository.findProductById).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductById).toHaveBeenCalledWith(1);
      expect(productsRepository.findProductLike).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductLike).toHaveBeenCalledWith(userId, 1);
      expect(product).toEqual({ ...mockProduct, isLiked: false });
    });
  });

  // createProduct 메서드 테스트
  describe('createProduct', () => {
    it('새로운 상품을 성공적으로 생성해야 합니다.', async () => {
      const createProductDto = { name: 'New Product', content: 'New Content', price: 5000 };
      const userId = 1;
      const mockNewProduct = { id: 3, ...createProductDto, authorId: userId, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
      // createProduct 메서드가 mockNewProduct를 반환하도록 설정합니다.
      productsRepository.createProduct.mockResolvedValue(mockNewProduct);

      const newProduct = await productsService.createProduct(createProductDto, userId);

      expect(productsRepository.createProduct).toHaveBeenCalledTimes(1);
      expect(productsRepository.createProduct).toHaveBeenCalledWith({
        name: createProductDto.name,
        content: createProductDto.content,
        price: createProductDto.price,
        author: { connect: { id: userId } },
      });
      expect(newProduct).toEqual(mockNewProduct);
    });
  });

  // updateProduct 메서드 테스트
  describe('updateProduct', () => {
    const mockExistingProduct = { id: 1, name: 'Old Name', content: 'Old Content', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
    const userId = 1;

    it('상품을 성공적으로 업데이트해야 합니다.', async () => {
      const updateProductDto = { name: 'Updated Name', content: 'Updated Content', price: 1500 };
      const mockUpdatedProduct = { ...mockExistingProduct, ...updateProductDto };

      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);
      productsRepository.updateProduct.mockResolvedValue(mockUpdatedProduct);

      const updatedProduct = await productsService.updateProduct(mockExistingProduct.id, userId, updateProductDto);

      expect(productsRepository.findProductByIdSimple).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductByIdSimple).toHaveBeenCalledWith(mockExistingProduct.id);
      expect(productsRepository.updateProduct).toHaveBeenCalledTimes(1);
      expect(productsRepository.updateProduct).toHaveBeenCalledWith(mockExistingProduct.id, {
        name: updateProductDto.name,
        content: updateProductDto.content,
        price: updateProductDto.price,
      });
      expect(updatedProduct).toEqual(mockUpdatedProduct);
    });

    it('상품을 찾을 수 없을 때 NotFoundError를 던져야 합니다.', async () => {
      productsRepository.findProductByIdSimple.mockResolvedValue(null);

      await expect(productsService.updateProduct(999, userId, { name: 'Any' })).rejects.toThrow('상품을 찾을 수 없습니다.');
      await expect(productsService.updateProduct(999, userId, { name: 'Any' })).rejects.toHaveProperty('name', 'NotFoundError');
    });

    it('상품 수정 권한이 없을 때 ForbiddenError를 던져야 합니다.', async () => {
      const otherUserId = 2;
      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);

      await expect(productsService.updateProduct(mockExistingProduct.id, otherUserId, { name: 'Any' })).rejects.toThrow('상품을 수정할 권한 없습니다.');
      await expect(productsService.updateProduct(mockExistingProduct.id, otherUserId, { name: 'Any' })).rejects.toHaveProperty('name', 'ForbiddenError');
    });

    it('수정할 정보가 없을 때 BadRequestError를 던져야 합니다.', async () => {
      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);

      await expect(productsService.updateProduct(mockExistingProduct.id, userId, {})).rejects.toThrow('수정할 정보를 입력해주세요.');
      await expect(productsService.updateProduct(mockExistingProduct.id, userId, {})).rejects.toHaveProperty('name', 'BadRequestError');
    });

    it('가격이 변경되면 좋아요를 누른 사용자에게 알림을 보내야 합니다.', async () => {
      const updateProductDto = { price: 2000 };
      const likedUsers = [{ userId: 10, productId: 1, createdAt: new Date(), updatedAt: new Date() }];
      const mockUpdatedProduct = { ...mockExistingProduct, price: updateProductDto.price };

      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);
      productsRepository.updateProduct.mockResolvedValue(mockUpdatedProduct);
      productsRepository.findProductLikesByProductId.mockResolvedValue(likedUsers);

      // NotificationsService의 createNotification 메서드를 스파이합니다.
      const createNotificationSpy = jest.spyOn(productsService.notificationsService, 'createNotification');

      await productsService.updateProduct(mockExistingProduct.id, userId, updateProductDto);

      expect(productsRepository.findProductLikesByProductId).toHaveBeenCalledWith(mockExistingProduct.id);
      expect(createNotificationSpy).toHaveBeenCalledTimes(likedUsers.length);
      expect(createNotificationSpy).toHaveBeenCalledWith(
        likedUsers[0].userId,
        'PRICE_CHANGE',
        `좋아요한 상품 '${mockExistingProduct.name}'의 가격이 ${mockExistingProduct.price}원에서 ${updateProductDto.price}원으로 변경되었습니다.`,
        mockExistingProduct.id,
      );
    });
  });

  // deleteProduct 메서드 테스트
  describe('deleteProduct', () => {
    const mockExistingProduct = { id: 1, name: 'Product to Delete', content: 'Content', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
    const userId = 1;

    it('상품을 성공적으로 삭제해야 합니다.', async () => {
      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);
      productsRepository.deleteProduct.mockResolvedValue(mockExistingProduct); // deleteProduct는 삭제된 객체를 반환한다고 가정

      await productsService.deleteProduct(mockExistingProduct.id, userId);

      expect(productsRepository.findProductByIdSimple).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductByIdSimple).toHaveBeenCalledWith(mockExistingProduct.id);
      expect(productsRepository.deleteProduct).toHaveBeenCalledTimes(1);
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith(mockExistingProduct.id);
    });

    it('상품을 찾을 수 없을 때 NotFoundError를 던져야 합니다.', async () => {
      productsRepository.findProductByIdSimple.mockResolvedValue(null);

      await expect(productsService.deleteProduct(999, userId)).rejects.toThrow('상품을 찾을 수 없습니다.');
      await expect(productsService.deleteProduct(999, userId)).rejects.toHaveProperty('name', 'NotFoundError');
    });

    it('상품 삭제 권한이 없을 때 ForbiddenError를 던져야 합니다.', async () => {
      const otherUserId = 2;
      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);

      await expect(productsService.deleteProduct(mockExistingProduct.id, otherUserId)).rejects.toThrow('상품 등록자만이 삭제할 수 있습니다.');
      await expect(productsService.deleteProduct(mockExistingProduct.id, otherUserId)).rejects.toHaveProperty('name', 'ForbiddenError');
    });
  });

  // toggleProductLike 메서드 테스트
  describe('toggleProductLike', () => {
    const mockExistingProduct = { id: 1, name: 'Product', content: 'Content', price: 1000, authorId: 1, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } };
    const userId = 2;

    it('좋아요가 없을 때 좋아요를 추가해야 합니다.', async () => {
      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);
      productsRepository.findProductLike.mockResolvedValue(null);
      productsRepository.createProductLike.mockResolvedValue({ userId, productId: 1 });

      const result = await productsService.toggleProductLike(mockExistingProduct.id, userId);

      expect(productsRepository.findProductByIdSimple).toHaveBeenCalledWith(mockExistingProduct.id);
      expect(productsRepository.findProductLike).toHaveBeenCalledWith(userId, mockExistingProduct.id);
      expect(productsRepository.createProductLike).toHaveBeenCalledWith(userId, mockExistingProduct.id);
      expect(result).toEqual({ message: '좋아요를 눌렀습니다.' });
    });

    it('좋아요가 있을 때 좋아요를 취소해야 합니다.', async () => {
      const mockLike = { userId, productId: 1 };
      productsRepository.findProductByIdSimple.mockResolvedValue(mockExistingProduct);
      productsRepository.findProductLike.mockResolvedValue(mockLike);
      productsRepository.deleteProductLike.mockResolvedValue(mockLike);

      const result = await productsService.toggleProductLike(mockExistingProduct.id, userId);

      expect(productsRepository.findProductByIdSimple).toHaveBeenCalledWith(mockExistingProduct.id);
      expect(productsRepository.findProductLike).toHaveBeenCalledWith(userId, mockExistingProduct.id);
      expect(productsRepository.deleteProductLike).toHaveBeenCalledWith(userId, mockExistingProduct.id);
      expect(result).toEqual({ message: '좋아요 취소했습니다.' });
    });

    it('상품을 찾을 수 없을 때 NotFoundError를 던져야 합니다.', async () => {
      productsRepository.findProductByIdSimple.mockResolvedValue(null);

      await expect(productsService.toggleProductLike(999, userId)).rejects.toThrow('상품을 찾을 수 없습니다.');
      await expect(productsService.toggleProductLike(999, userId)).rejects.toHaveProperty('name', 'NotFoundError');
    });
  });

  // getProductsByAuthor 메서드 테스트
  describe('getProductsByAuthor', () => {
    it('특정 저자의 모든 상품을 반환해야 합니다.', async () => {
      const userId = 1;
      const mockProducts = [
        { id: 1, name: 'Author Product 1', content: 'Content 1', price: 1000, authorId: userId, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } },
        { id: 2, name: 'Author Product 2', content: 'Content 2', price: 2000, authorId: userId, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } },
      ];
      productsRepository.findProductsByAuthorId.mockResolvedValue(mockProducts);

      const products = await productsService.getProductsByAuthor(userId);

      expect(productsRepository.findProductsByAuthorId).toHaveBeenCalledTimes(1);
      expect(productsRepository.findProductsByAuthorId).toHaveBeenCalledWith(userId);
      expect(products).toEqual(mockProducts);
    });
  });

  // getLikedProducts 메서드 테스트
  describe('getLikedProducts', () => {
    it('사용자가 좋아요를 누른 모든 상품을 반환해야 합니다.', async () => {
      const userId = 1;
      const mockLikedProducts = [
        { id: 1, name: 'Liked Product 1', content: 'Content 1', price: 1000, authorId: 2, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } },
        { id: 2, name: 'Liked Product 2', content: 'Content 2', price: 2000, authorId: 3, createdAt: new Date(), updatedAt: new Date(), author: { nickname: 'testuser' } },
      ];
      productsRepository.findLikedProductsByUserId.mockResolvedValue(mockLikedProducts);

      const likedProducts = await productsService.getLikedProducts(userId);

      expect(productsRepository.findLikedProductsByUserId).toHaveBeenCalledTimes(1);
      expect(productsRepository.findLikedProductsByUserId).toHaveBeenCalledWith(userId);
      expect(likedProducts).toEqual(mockLikedProducts);
    });
  });
});
