export class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
  this._name = name;
  this._description = description;
  this._price = price;
  this._tags = tags;
  this._images = images;
  this._favoriteCount = favoriteCount
  }

  set price(input) {
    this._price = input;
  }

  set tags(input) {
    this._tags = input;
  }

  set images(input) {
    this._images = input;
  }

  get price() {
    return this._price;
  }
  
  get tags() {
    return this._tags;
  }

  get images() {
    return this._images;
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this.favoriteCount ++;
  }
}

export class ElectronicProduct extends Product{
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }

  set manufacturer(input) {
    this._manufacturer = input;
  }

  get manufacturer() {
    return this._manufacturer;
  }
}