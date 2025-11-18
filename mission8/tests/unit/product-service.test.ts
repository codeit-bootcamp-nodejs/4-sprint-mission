import { jest } from '@jest/globals';

import { Product } from '../../src/domain/product/product';
import { productRepository } from '../../src/domain/product/product.repository';
import { productService } from '../../src/domain/product/product.service';
import type { UpdatePriceInput } from '../../src/domain/product/product.type';

describe('ProductService.updatePrice', () => {
  const productId = 1;
  const userId = 1;
  let updateInput: UpdatePriceInput;

  beforeEach(() => {
    jest.clearAllMocks();
    updateInput = { productId, price: 10000, userId };
  });

  it('정상적으로 가격 변경', async () => {
    const mockProduct = new Product({
      id: productId,
      name: 'Test Product',
      price: 5000,
      userId: userId,
    });

    jest.spyOn(mockProduct, 'updatePrice');
    jest.spyOn(productRepository, 'findById').mockResolvedValue(mockProduct);
    jest.spyOn(productRepository, 'updatePrice').mockResolvedValue({
      id: productId,
      name: 'Test Product',
      description: 'Test Description',
      price: 10000,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      likeCount: 0,
      commentCount: 0,
      userId,
    });

    const result = await productService.updatePrice(updateInput);

    expect(result.price).toBe(10000);
    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(mockProduct.updatePrice).toHaveBeenCalledWith(10000);
    expect(productRepository.updatePrice).toHaveBeenCalledWith(updateInput);
  });

  it('존재하지 않는 상품 -> 에러', async () => {
    jest.spyOn(productRepository, 'findById').mockResolvedValue(null);

    await expect(productService.updatePrice(updateInput)).rejects.toThrow('상품을 찾을 수 없습니다');
  });

  it('음수 가격 -> 에러', async () => {
    const mockProduct = new Product({
      id: productId,
      name: 'Test Product',
      price: 5000,
      userId,
    });

    jest.spyOn(mockProduct, 'updatePrice').mockImplementation(() => {
      throw new Error('가격은 0보다 커야 합니다');
    });

    jest.spyOn(productRepository, 'findById').mockResolvedValue(mockProduct);
    updateInput.price = -1;

    await expect(productService.updatePrice(updateInput)).rejects.toThrow('가격은 0보다 커야 합니다');
  });
});
