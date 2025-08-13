// Product.js
export class Product {
  #favoriteCount;

  constructor({
    name,
    description,
    price,
    tags,
    images,
    favoriteCount = 0,
    createdAt,
    updatedAt,
  }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.#favoriteCount = favoriteCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  favorite() {
    this.#favoriteCount++;
  }

  get favoriteCount() {
    return this.#favoriteCount;
  }
}

export class ElectronicProduct extends Product {
  constructor(productData) {
    super(productData);
    this.manufacturer = productData.manufacturer || 'unknown';
  }
}
