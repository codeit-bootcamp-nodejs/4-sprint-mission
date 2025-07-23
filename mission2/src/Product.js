class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
  this.name = name;
  this.description = description;
  this.price = price;
  this.tags = tags;
  this.images = images;
  this.favoriteCount = favoriteCount
  }

  favorite() {
    favoriteCount ++;
  }
}

class ElectronicProduct extends Product{
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}
