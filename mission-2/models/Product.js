// models/Product.js

export class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = tags;
    this._images = images;
    this._favoriteCount = favoriteCount;
  }

  // getter 메서드들
  get name() {
    return this._name;
  }

  get description() {
    return this._description;
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

  // setter 메서드들
  set name(value) {
    if (typeof value === 'string' && value.length > 0) {
      this._name = value;
    } else {
      throw new Error('상품명은 비어있지 않은 문자열이어야 합니다.');
    }
  }

  set description(value) {
    if (typeof value === 'string') {
      this._description = value;
    } else {
      throw new Error('설명은 문자열이어야 합니다.');
    }
  }

  set price(value) {
    if (typeof value === 'number' && value >= 0) {
      this._price = value;
    } else {
      throw new Error('가격은 0 이상의 숫자여야 합니다.');
    }
  }

  set tags(value) {
    if (Array.isArray(value)) {
      this._tags = value;
    } else {
      throw new Error('태그는 배열이어야 합니다.');
    }
  }

  set images(value) {
    if (Array.isArray(value)) {
      this._images = value;
    } else {
      throw new Error('이미지는 배열이어야 합니다.');
    }
  }

  // favoriteCount는 직접 설정할 수 없고, favorite() 메서드를 통해서만 증가
  favorite() {
    this._favoriteCount++;
  }
}

export class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer,
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }

  get manufacturer() {
    return this._manufacturer;
  }

  set manufacturer(value) {
    if (typeof value === 'string') {
      this._manufacturer = value;
    } else {
      throw new Error('제조사는 문자열이어야 합니다.');
    }
  }
}
