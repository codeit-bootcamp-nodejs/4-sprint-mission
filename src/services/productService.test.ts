import * as productService from './productService';
import * as productRepository from '../repositories/productRepository';

jest.mock('../repositories/productRepository');

describe('Product Service Unit Tests', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed',
    nickname: 'TestUser',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 1000,
    tags: ['electronics', 'test'],
    userId: mockUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should successfully create a product', async () => {
      jest.mocked(productRepository.createProduct).mockResolvedValue(mockProduct);

      const productData = {
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        tags: mockProduct.tags,
        userId: mockProduct.userId,
      };

      const result = await productService.createProduct(productData);

      expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
      expect(productRepository.createProduct).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProduct);
    });

    it('should pass correct data to repository', async () => {
      const spy = jest.spyOn(productRepository, 'createProduct').mockResolvedValue(mockProduct);

      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 2000,
        tags: ['new'],
        userId: 2,
      };

      await productService.createProduct(productData);

      expect(spy).toHaveBeenCalledWith(productData);
      expect(spy.mock.calls[0][0]).toMatchObject(productData);

      spy.mockRestore();
    });
  });

  describe('getProductById', () => {
    it('should return product when it exists', async () => {
      const productWithUser = {
        ...mockProduct,
        user: {
          id: mockUser.id,
          nickname: mockUser.nickname,
        },
      };

      jest.mocked(productRepository.getProductById).mockResolvedValue(productWithUser);

      const result = await productService.getProductById(mockProduct.id);

      expect(productRepository.getProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toEqual(productWithUser);
    });

    it('should throw error when product not found', async () => {
      jest.mocked(productRepository.getProductById).mockResolvedValue(null);

      await expect(productService.getProductById(999)).rejects.toThrow('Product not found');
      expect(productRepository.getProductById).toHaveBeenCalledWith(999);
    });
  });

  describe('getProducts', () => {
    it('should return list of products', async () => {
      const mockList = {
        list: [mockProduct],
        totalCount: 1,
      };

      jest.mocked(productRepository.getProducts).mockResolvedValue(mockList);

      const params = { page: 1, pageSize: 10 };
      const result = await productService.getProducts(params);

      expect(productRepository.getProducts).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockList);
    });

    it('should pass filtering parameters correctly', async () => {
      const spy = jest.spyOn(productRepository, 'getProducts').mockResolvedValue({
        list: [],
        totalCount: 0,
      });

      const params = {
        page: 2,
        pageSize: 20,
        keyword: 'laptop',
        sortBy: 'recent',
      };

      await productService.getProducts(params);

      expect(spy).toHaveBeenCalledWith(params);
      expect(spy.mock.calls[0][0]).toMatchObject(params);

      spy.mockRestore();
    });
  });

  describe('updateProduct', () => {
    it('should update product when user is owner', async () => {
      const productWithUser = {
        ...mockProduct,
        user: {
          id: mockUser.id,
          nickname: mockUser.nickname,
        },
      };

      jest.mocked(productRepository.getProductById).mockResolvedValue(productWithUser);
      jest.mocked(productRepository.updateProduct).mockResolvedValue({
        ...mockProduct,
        name: 'Updated Name',
      });

      const updateData = { name: 'Updated Name' };
      const result = await productService.updateProduct(mockProduct.id, mockUser.id, updateData);

      expect(productRepository.getProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(productRepository.updateProduct).toHaveBeenCalledWith(mockProduct.id, updateData);
      expect(result.name).toBe('Updated Name');
    });

    it('should throw error when product not found', async () => {
      jest.mocked(productRepository.getProductById).mockResolvedValue(null);

      await expect(
        productService.updateProduct(999, mockUser.id, { name: 'Updated' })
      ).rejects.toThrow('Product not found');
    });

    it('should throw error when user is not owner', async () => {
      const productWithUser = {
        ...mockProduct,
        user: {
          id: mockUser.id,
          nickname: mockUser.nickname,
        },
      };

      jest.mocked(productRepository.getProductById).mockResolvedValue(productWithUser);

      const differentUserId = 999;

      await expect(
        productService.updateProduct(mockProduct.id, differentUserId, { name: 'Hacked' })
      ).rejects.toThrow('You are not authorized to update this product');

      expect(productRepository.updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete product when user is owner', async () => {
      const productWithUser = {
        ...mockProduct,
        user: {
          id: mockUser.id,
          nickname: mockUser.nickname,
        },
      };

      jest.mocked(productRepository.getProductById).mockResolvedValue(productWithUser);
      jest.mocked(productRepository.deleteProduct).mockResolvedValue(mockProduct);

      const result = await productService.deleteProduct(mockProduct.id, mockUser.id);

      expect(productRepository.getProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(productRepository.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when user is not owner', async () => {
      const productWithUser = {
        ...mockProduct,
        user: {
          id: mockUser.id,
          nickname: mockUser.nickname,
        },
      };

      jest.mocked(productRepository.getProductById).mockResolvedValue(productWithUser);

      const unauthorizedUserId = 777;

      await expect(
        productService.deleteProduct(mockProduct.id, unauthorizedUserId)
      ).rejects.toThrow('You are not authorized to delete this product');

      expect(productRepository.deleteProduct).not.toHaveBeenCalled();
    });

    it('should verify authorization before deletion using spy', async () => {
      const getByIdSpy = jest.spyOn(productRepository, 'getProductById').mockResolvedValue({
        ...mockProduct,
        user: { id: mockUser.id, nickname: mockUser.nickname },
      });

      const deleteSpy = jest.spyOn(productRepository, 'deleteProduct').mockResolvedValue(mockProduct);

      await productService.deleteProduct(mockProduct.id, mockUser.id);

      expect(getByIdSpy).toHaveBeenCalledBefore(deleteSpy);
      expect(deleteSpy).toHaveBeenCalledAfter(getByIdSpy);

      getByIdSpy.mockRestore();
      deleteSpy.mockRestore();
    });
  });
});
