import { eventBus } from '../../utils/event-bus.js';
import { productRepository } from './product.repository.js';
import type { UpdatePriceParams } from './product.type.js';

class ProductService {
  updatePrice = async (params: UpdatePriceParams) => {
    const { productId, price: newPrice } = params;

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    product.updatePrice(newPrice);

    await productRepository.updatePrice(productId, newPrice);

    const events = product.getDomainEvents();
    for (const event of events) {
      await eventBus.publish(event);
    }
    product.clearDomainEvents();

    return product;
  };
}

export const productService = new ProductService();
