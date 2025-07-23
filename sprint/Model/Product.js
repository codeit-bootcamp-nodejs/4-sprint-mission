export class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }
  favorite() {
    this.favoriteCount++;
  }
}

export class ElectronicProduct extends Product {
  constructor(
    name,
    desciption,
    price,
    tags,
    images,
    mmanufacturer,
    favoriteCount
  ) {
    super(name, desciption, price, tags, images, favoriteCount);
    this.mmanufacturer = mmanufacturer;
  }
}
