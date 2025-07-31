// models/ElectronicProduct.js
import Product from './Product.js';

export default class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }
}
