import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { eventBus } from '../../utils/event-bus.js';
import { HttpException } from '../../utils/http-exception.js';
import { productRepository } from './product.repository.js';
import type { UpdatePriceInput } from './product.type.js';

class ProductService {
  updatePrice = async (updateDate: UpdatePriceInput) => {
    const { productId, price: newPrice, userId } = updateDate;

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.productNotFound);
    }
    if (product.userId !== userId) {
      throw new HttpException(STATUS_CODE.FORBIDDEN, MESSAGE.forbidden);
    }

    product.updatePrice(newPrice);

    await productRepository.updatePrice(updateDate);

    const events = product.getDomainEvents();
    for (const event of events) {
      await eventBus.publish(event);
    }
    product.clearDomainEvents();

    return product;
  };
}

export const productService = new ProductService();
