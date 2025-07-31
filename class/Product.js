// models/Product.js
import Content from './Content.js';

export default class Product extends Content {
  constructor(name, description, price, tags = [], images = []) {
    super();
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
  }
}
